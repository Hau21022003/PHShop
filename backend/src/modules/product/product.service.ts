import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import mongoose, { Model } from 'mongoose';
import { Product } from 'src/modules/product/schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateStockDto } from 'src/modules/product/dto/update-stock.dto';
import {
  FindAllDto,
  PriceFilter,
  SortBy,
} from 'src/modules/product/dto/find-all.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
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
    const filter: Record<string, any> = {
      // active: true,
    };

    if (dto.active) filter.active = true;

    if (dto.search) {
      filter.name = { $regex: dto.search, $options: 'i' };
    }

    if (dto.filter?.categoryIds?.length > 0) {
      filter.category = {
        $in: dto.filter.categoryIds.map(
          (id) => new mongoose.Types.ObjectId(id),
        ),
      };
    }

    if (dto.filter?.gender) {
      filter.gender = { $regex: `^${dto.filter.gender}$`, $options: 'i' };
    }

    if (dto.filter?.sale) {
      filter.discount = { $gt: 0 };
    }

    if (dto.filter?.price?.length) {
      filter.$or = this.buildPriceConditions(dto.filter.price);
    }

    const sort = this.buildSort(dto.filter?.sortBy);

    const total = await this.productModel.countDocuments(filter);

    const items = await this.productModel
      .find(filter)
      .populate('category')
      .sort(sort) // -1: mới nhất lên đầu, 1: cũ nhất trước
      .skip(dto.offset)
      .limit(dto.pageSize)
      .lean()
      .exec();
    return { items, total };
  }

  private buildPriceConditions(priceFilters: PriceFilter[]) {
    const ranges: Record<PriceFilter, any> = {
      [PriceFilter.BELOW_200K]: { price: { $lt: 200_000 } },
      [PriceFilter.FROM_200K_TO_400K]: {
        price: { $gte: 200_000, $lt: 400_000 },
      },
      [PriceFilter.FROM_400K_TO_600K]: {
        price: { $gte: 400_000, $lt: 600_000 },
      },
      [PriceFilter.FROM_600K_TO_800K]: {
        price: { $gte: 600_000, $lt: 800_000 },
      },
      [PriceFilter.ABOVE_800K]: { price: { $gte: 800_000 } },
    };
    return priceFilters.map((pf) => ranges[pf]);
  }

  private buildSort(sortBy?: SortBy): Record<string, 1 | -1> {
    const sortMap: Record<SortBy, Record<string, 1 | -1>> = {
      [SortBy.NEWEST]: { createdAt: -1 },
      [SortBy.PRICE_LOW_TO_HIGH]: { price: 1 },
      [SortBy.PRICE_HIGH_TO_LOW]: { price: -1 },
      [SortBy.FEATURED]: { sold: -1 },
    };
    return sortBy ? sortMap[sortBy] : { createdAt: -1 };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean().exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async getProductDetail(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
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
    const product: Record<string, any> = { ...dto };
    if (dto.variants.length !== 0) {
      product.quantity = dto.variants.reduce(
        (sum, variant) => sum + variant.quantity,
        0,
      );
    }
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

  async decreaseStock(
    productId: string,
    quantity: number,
    variantAttributes?: { title: string; option: string }[],
  ) {
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    // Case 1: Product has variants
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) =>
        this.isSameAttributes(variantAttributes || [], v.attributes || []),
      );

      if (!variant) {
        throw new BadRequestException('Product variant not found');
      }

      if (variant.quantity < quantity) {
        throw new BadRequestException('Not enough stock for this variant');
      }

      // Decrease variant stock
      variant.quantity -= quantity;

      // Decrease global product stock as well
      product.quantity = Math.max(0, product.quantity - quantity);
    }
    // Case 2: Product has no variants
    else {
      if (product.quantity < quantity) {
        throw new BadRequestException('Not enough stock for this product');
      }
      product.quantity -= quantity;
    }

    product.sold += quantity;
    product.markModified('variants');

    await product.save();
    return product;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private buildProductData(dto: CreateProductDto | UpdateProductDto) {
    const variantImages = dto.variantStructure.reduce(
      (accumulator, currentVariantStructure) => {
        if (!currentVariantStructure.enableImage) {
          return accumulator;
        }
        const optionImages = currentVariantStructure.options
          .filter((item) => item.image)
          .map((item) => item.image);
        return [...accumulator, ...optionImages];
      },
      [] as string[],
    );

    const descriptionImages = [
      ...this.getImgSrcFromHtml(dto.description),
      ...variantImages,
    ];

    if (dto.variants.length !== 0) {
      dto.quantity = dto.variants.reduce(
        (sum, variant) => sum + variant.quantity,
        0,
      );
    }

    return {
      ...dto,
      descriptionImages,
    };
  }

  isSameAttributes(
    a: { title: string; option: string }[],
    b: { title: string; option: string }[],
  ) {
    if (a.length !== b.length) return false;
    return a.every((attr) =>
      b.some((x) => x.title === attr.title && x.option === attr.option),
    );
  }

  async updateReviewStats(
    productId: string,
    averageRating: number,
    reviewCount: number,
  ) {
    const updated = await this.productModel.findByIdAndUpdate(
      productId,
      { $set: { averageRating: averageRating, reviewCount: reviewCount } },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    return updated;
  }

  async getTopSaleProduct() {
    return this.productModel
      .findOne({ active: true }) // chỉ lấy sản phẩm đang active
      .sort({ sold: -1 }) // sắp xếp giảm dần theo sold
      .exec();
  }
}
