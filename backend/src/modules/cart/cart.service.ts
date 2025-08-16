import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CartItem } from 'src/modules/cart/schema/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name)
    private cartItemModel: Model<CartItem>,
  ) {}

  create(createCartDto: CreateCartItemDto, userId: string) {
    const cartItem = this.attachUserToCartItem(userId, createCartDto);
    const created = new this.cartItemModel(cartItem);
    return created.save();
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: string, updateCartDto: UpdateCartItemDto, userId: string) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  private attachUserToCartItem(
    userId: string,
    cartDto: UpdateCartItemDto | CreateCartItemDto,
  ) {
    return { ...cartDto, user: userId };
  }
}
