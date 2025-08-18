import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from 'src/modules/cart/schema/cart.schema';
import { ProductModule } from 'src/modules/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
