import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from 'src/modules/review/schema/review.schema';
import mongoose, { Model, Types } from 'mongoose';
import { OrdersService } from 'src/modules/orders/orders.service';
import {
  ReviewSearchStatus,
  FindByProductDto,
} from 'src/modules/review/dto/search.dto';
import {
  DateFilter,
  FindAllDto,
  ReplyStatus,
} from 'src/modules/review/dto/find-all.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly orderService: OrdersService,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    await this.ensureNotReviewed(
      createReviewDto.product,
      createReviewDto.order,
      userId,
    );
    const order = await this.orderService.findOne(createReviewDto.order);
    const createData = {
      ...createReviewDto,
      user: userId,
      userSnapshot: { fullName: order.contactDetails.fullName },
    };
    const created = new this.reviewModel(createData);
    const review = await created.save();
    await this.markOrderAsReviewedIfCompleted(
      createReviewDto.order,
      createReviewDto.product,
    );

    return review;
  }

  private async ensureNotReviewed(
    productId: string,
    orderId: string,
    userId: string,
  ) {
    const review = await this.reviewModel
      .findOne({
        order: new Types.ObjectId(orderId),
        user: new Types.ObjectId(userId),
        product: new Types.ObjectId(productId),
      })
      .lean()
      .exec();
    if (review) {
      throw new BadRequestException(
        'You have already reviewed this product in this order.',
      );
    }
  }

  private async markOrderAsReviewedIfCompleted(
    orderId: string,
    productId: string,
  ) {
    return await this.orderService.markItemAsReviewed(orderId, productId);
  }

  async findAll(query: FindAllDto) {
    const filter = this.buildFilterFindAll(query);
    const items = await this.reviewModel.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $match: {
          ...filter,
        },
      },
    ]);

    const replyStatusSummary = await this.buildReplyStatusSummary();

    return { replyStatusSummary, items };
  }

  private buildFilterFindAll(query: FindAllDto) {
    const filter: Record<string, any> = {};
    if (query.rating) {
      filter.rating = query.rating;
    }
    if (query.search) {
      filter.$or = [
        { 'product.name': { $regex: query.search, $options: 'i' } },
        { 'userSnapshot.fullName': { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.dateFilter) {
      const { start, end } = this.mapDateFilter(query.dateFilter);
      if (start || end) {
        filter.createdAt = {};
        if (start) filter.createdAt.$gte = start;
        if (end) filter.createdAt.$lte = end;
      }
    }

    if (query.replyStatus === ReplyStatus.PENDING) {
      filter.shopReply = null;
    } else if (query.replyStatus === ReplyStatus.REPLIED) {
      filter.shopReply = { $ne: null };
    }
    return filter;
  }

  private mapDateFilter(dateFilter: DateFilter) {
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined;

    switch (dateFilter) {
      case DateFilter.TODAY:
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case DateFilter.YESTERDAY:
        start = new Date(now.setDate(now.getDate() - 1));
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case DateFilter.LAST_7_DAYS:
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;
      case DateFilter.LAST_30_DAYS:
        start = new Date();
        start.setDate(start.getDate() - 30);
        break;
      case DateFilter.THIS_MONTH:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        break;
      case DateFilter.LAST_MONTH:
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        break;
      case DateFilter.THIS_YEAR:
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case DateFilter.LAST_YEAR:
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        break;
      case DateFilter.ALL_TIME:
        start = undefined;
        end = undefined;
        break;
    }
    return { start, end };
  }

  private async buildReplyStatusSummary() {
    const summaryAgg = await this.reviewModel.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ['$shopReply', false] },
              ReplyStatus.REPLIED,
              ReplyStatus.PENDING,
            ],
          },
          total: { $sum: 1 },
        },
      },
    ]);

    return summaryAgg.reduce(
      (acc, cur) => {
        acc[cur._id as ReplyStatus] = cur.total;
        return acc;
      },
      { [ReplyStatus.PENDING]: 0, [ReplyStatus.REPLIED]: 0 } as Record<
        ReplyStatus,
        number
      >,
    );
  }

  async findByProduct(dto: FindByProductDto) {
    const filter = this.buildFilterFindByProduct(dto);
    const summary = await this.buildSummary(dto.productId);
    const items = await this.reviewModel.find(filter).lean().exec();

    return { summary, items };
  }

  async findSummaryByProduct(productId: string) {
    const summary = await this.buildSummary(productId);
    return { summary };
  }

  private buildFilterFindByProduct(dto: FindByProductDto) {
    const filter: Record<string, any> = {
      product: new Types.ObjectId(dto.productId),
    };
    switch (dto.status) {
      case ReviewSearchStatus.ONE_STAR:
        filter.rating = 1;
        break;
      case ReviewSearchStatus.TWO_STAR:
        filter.rating = 2;
        break;
      case ReviewSearchStatus.THREE_STAR:
        filter.rating = 3;
        break;
      case ReviewSearchStatus.FOUR_STAR:
        filter.rating = 4;
        break;
      case ReviewSearchStatus.FIVE_STAR:
        filter.rating = 5;
        break;

      case ReviewSearchStatus.WITH_IMAGES:
        filter.images = { $exists: true, $ne: [] };
        break;
    }
    return filter;
  }

  private async buildSummary(productId: string) {
    const summaryAgg = await this.reviewModel.aggregate([
      {
        $match: { product: new Types.ObjectId(productId) },
      },
      { $group: { _id: '$rating', total: { $sum: 1 } } },
    ]);

    return summaryAgg.reduce(
      (acc, cur) => {
        acc[cur._id] = cur.total;
        return acc;
      },
      {} as Record<number, number>,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  findOneByOrder(orderId: string) {
    return this.reviewModel
      .find({ order: new mongoose.Types.ObjectId(orderId) })
      .lean()
      .exec();
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
