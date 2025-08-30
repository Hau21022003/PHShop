import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
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
import { ReplyDto } from 'src/modules/review/dto/reply.dto';
import { ProductService } from 'src/modules/product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productService: ProductService,
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
    await this.orderService.markItemAsReviewed(
      createReviewDto.order,
      createReviewDto.product,
    );
    await this.updateProductReviewStats(createReviewDto.product);
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

  private async updateProductReviewStats(productId: string) {
    // const reviews = await this.findByProduct({ productId: productId });
    // const count = reviews.length;
    // const totalScore = reviews.reduce((acc, review) => acc + review.rating, 0);
    const stats = await this.reviewModel.aggregate([
      { $match: { product: new Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          average: { $avg: '$rating' },
        },
      },
    ]);
    const count = stats[0]?.count || 0;
    const average = stats[0]?.average || 0;
    await this.productService.updateReviewStats(productId, average, count);

    // const count = stats[0]?.count || 0;
    // const average = stats[0]?.average || 0;
    // const averageScore = count > 0 ? totalScore / count : 0;
    // await this.productService.updateReviewStats(productId, averageScore, count);
  }

  async findAll(query: FindAllDto) {
    const filter = this.buildFilterFindAll(query);
    const result = await this.reviewModel.aggregate([
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
      {
        $facet: {
          items: [
            { $sort: { createdAt: -1 } },
            { $skip: query.offset || 0 },
            { $limit: query.pageSize || 10 },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    const items = result[0].items;
    const total = result[0].totalCount[0]?.count || 0;

    const replyStatusSummary = await this.buildReplyStatusSummary();

    return { replyStatusSummary, items, total };
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
    return await this.reviewModel.find(filter).lean().exec();
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

  async buildSummary(productId: string) {
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

  async reply(id: string, dto: ReplyDto) {
    const updated = await this.reviewModel.findByIdAndUpdate(
      id,
      { $set: { ...dto, shopReplyAt: new Date() } },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return updated;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
