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

  findAll() {
    return this.categoryModel.find().lean().exec();
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
