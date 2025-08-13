import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from 'src/modules/product/schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateStockDto } from 'src/modules/product/dto/update-stock.dto';
import { FindAllDto } from 'src/modules/product/dto/find-all.dto';
import { PaginationResultDto } from 'src/common/dto/pagination-result.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    // const variantImages = createProductDto.variants.reduce(
    //   (accumulator, currentVariant) => {
    //     if (
    //       !currentVariant.image ||
    //       createProductDto.images.includes(currentVariant.image)
    //     )
    //       return accumulator;
    //     else return [...accumulator, currentVariant.image];
    //   },
    //   [],
    // );
    // const descriptionImages = [
    //   ...this.getImgSrcFromHtml(createProductDto.description),
    //   ...variantImages,
    // ];

    // const product = {
    //   ...createProductDto,
    //   descriptionImages,
    // };
    const product = this.buildProductData(createProductDto);
    const created = new this.productModel(product);
    return created.save();
  }

  private getImgSrcFromHtml(html: string) {
    const regex = /<img[^>]+src="([^"]+)"/g;

    let match;
    const srcList: string[] = [];

    while ((match = regex.exec(html)) !== null) {
      srcList.push(match[1]);
    }
    return srcList;
  }

  async find() {
    return this.productModel.find().lean().exec();
  }

  async findAll(dto: FindAllDto) {
    const filter = dto.search
      ? { name: { $regex: dto.search, $options: 'i' } }
      : {};

    const total = await this.productModel.countDocuments(filter);

    const items = await this.productModel
      .find(filter)
      .populate('category')
      .sort({ createdAt: -1 }) // -1: mới nhất lên đầu, 1: cũ nhất trước
      .skip(dto.offset)
      .limit(dto.pageSize)
      .lean()
      .exec();
    return { items, total };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean().exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // const variantImages = updateProductDto.variants.reduce(
    //   (accumulator, currentVariant) => {
    //     if (
    //       !currentVariant.image ||
    //       updateProductDto.images.includes(currentVariant.image)
    //     )
    //       return accumulator;
    //     else return [...accumulator, currentVariant.image];
    //   },
    //   [],
    // );
    // const descriptionImages = [
    //   ...this.getImgSrcFromHtml(updateProductDto.description),
    //   ...variantImages,
    // ];

    // const product = {
    //   ...updateProductDto,
    //   descriptionImages,
    // };

    const product = this.buildProductData(updateProductDto);
    const updated = await this.productModel.findByIdAndUpdate(
      id,
      { $set: product },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return updated;
  }

  async setActive(id: string, active: boolean): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { active },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateStock(id: string, dto: UpdateStockDto) {
    const updated = await this.productModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return updated;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private buildProductData(dto: CreateProductDto | UpdateProductDto) {
    const variantImages = dto.variants.reduce((accumulator, currentVariant) => {
      if (!currentVariant.image || dto.images.includes(currentVariant.image)) {
        return accumulator;
      }
      return [...accumulator, currentVariant.image];
    }, [] as string[]);

    const descriptionImages = [
      ...this.getImgSrcFromHtml(dto.description),
      ...variantImages,
    ];

    return {
      ...dto,
      descriptionImages,
    };
  }
}
