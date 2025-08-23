import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  CartItem,
  CartItemDocument,
} from 'src/modules/cart/schema/cart.schema';
import { Model } from 'mongoose';
import { ProductService } from 'src/modules/product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name)
    private cartItemModel: Model<CartItem>,
    private readonly productService: ProductService,
  ) {}

  async create(createCartDto: CreateCartItemDto, userId: string) {
    const existingCartItems = await this.cartItemModel
      .find({ user: userId, product: createCartDto.product })
      .populate('product')
      .lean();
    const matchedItem = existingCartItems.find((item) =>
      this.isSameAttributes(
        item.attributeVariant ?? [],
        createCartDto.attributeVariant ?? [],
      ),
    );

    if (matchedItem) {
      return this.update(
        matchedItem._id.toString(),
        {
          ...createCartDto,
          quantity: matchedItem.quantity + createCartDto.quantity,
        },
        userId,
      );
    }

    // Nếu chưa có item thì tạo mới
    const cartItem = await this.processCartItem(userId, createCartDto);
    const created = new this.cartItemModel(cartItem);
    return created.save();
  }

  async createBatch(createCartDto: CreateCartItemDto[], userId: string) {
    const results = [];

    for (const dto of createCartDto) {
      // tái sử dụng create() để xử lý gộp + stock
      const item = await this.create(dto, userId);
      results.push(item);
    }

    return results;
  }

  findAll(userId: string) {
    return this.cartItemModel
      .find({ user: userId })
      .sort({ updatedAt: -1 })
      .populate('product')
      .lean()
      .exec();
  }

  async findOne(id: string, userId: string) {
    const CartItem = await this.cartItemModel
      .findOne({ user: userId, _id: id })
      .populate('product')
      .lean();

    if (!CartItem) {
      throw new NotFoundException(`Cart item with id ${id} not found`);
    }

    return CartItem;
  }

  async update(id: string, updateCartDto: UpdateCartItemDto, userId: string) {
    const existingCartItem = await this.cartItemModel
      .findOne({ _id: id, user: userId })
      .populate('product');
    if (!existingCartItem) {
      throw new NotFoundException(`Cart item with id ${id} not found`);
    }

    const updateData = this.mapUpdateCartData(existingCartItem, updateCartDto);

    const updatedCartItem = await this.cartItemModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        { $set: updateData },
        { new: true },
      )
      .populate('product')
      .lean()
      .exec();

    return updatedCartItem;
  }

  async remove(id: string, userId: string) {
    const deletedCartItem = await this.cartItemModel
      .findOneAndDelete({ _id: id, user: userId })
      .populate('product')
      .lean()
      .exec();

    if (!deletedCartItem) {
      throw new NotFoundException(`Cart item with id ${id} not found`);
    }

    return deletedCartItem;
  }

  private async processCartItem(
    userId: string,
    cartDto: UpdateCartItemDto | CreateCartItemDto,
  ) {
    const product = await this.productService.findOne(cartDto.product);
    return {
      ...cartDto,
      user: userId,
      snapshot: {
        name: product.name,
        image: product.images.length !== 0 ? product.images[0] : '',
        price: product.price,
        discount: product.discount,
      },
    };
  }

  private mapUpdateCartData(
    existingCartItem: CartItemDocument,
    updateCartDto: UpdateCartItemDto,
  ) {
    // Nếu không gửi quantity thì giữ quantity cũ
    let newQuantity = updateCartDto.quantity ?? existingCartItem.quantity;

    // Tìm variant tương ứng
    const variant = existingCartItem.product.variants?.find((v) =>
      this.isSameAttributes(
        v.attributes,
        updateCartDto.attributeVariant ?? existingCartItem.attributeVariant,
      ),
    );
    const productStock = variant?.quantity ?? existingCartItem.product.quantity;

    // Nếu vượt quá stock thì chỉnh về stock
    if (newQuantity > productStock) {
      newQuantity = productStock;
    }

    return {
      ...updateCartDto,
      quantity: newQuantity,
    };
  }

  private isSameAttributes(
    a: { title: string; option: string }[],
    b: { title: string; option: string }[],
  ) {
    if (a.length !== b.length) return false;
    return a.every((attr) =>
      b.some((x) => x.title === attr.title && x.option === attr.option),
    );
  }
}
