import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/modules/category/schema/category.schema';
import { Model } from 'mongoose';
import { FindAllDto, Status } from 'src/modules/category/dto/find-all.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (category) throw new BadRequestException('Category name is existed');

    const created = new this.categoryModel(createCategoryDto);
    return created.save();
  }

  findAll(dto: FindAllDto) {
    const matchStage: Record<string, any> = dto.search
      ? { name: { $regex: dto.search, $options: 'i' } }
      : {};

    if (dto.status !== Status.ALL) {
      matchStage.active = dto.status === Status.ACTIVE;
    }

    return this.categoryModel
      .aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'products', // collection name của Product
            localField: '_id',
            foreignField: 'category',
            pipeline: [
              { $count: 'count' }, // chỉ đếm số lượng, không lấy dữ liệu
            ],
            as: 'productCountArr',
          },
        },
        {
          $addFields: {
            productQuantity: {
              $ifNull: [{ $arrayElemAt: ['$productCountArr.count', 0] }, 0],
            },
          },
        },
        { $project: { productCountArr: 0 } },
        { $sort: { createdAt: -1 } },
      ])
      .exec();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updated = await this.categoryModel.findByIdAndUpdate(
      id,
      { $set: updateCategoryDto },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.categoryModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return {
      message: `Category with id ${id} has been deleted`,
      deleted,
    };
  }
}
