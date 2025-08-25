import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/modules/orders/schema/order.schema';
import { ProductModule } from 'src/modules/product/product.module';
import { HttpModule } from '@nestjs/axios';
import { SettingsModule } from 'src/modules/settings/settings.module';
import { ProvinceModule } from 'src/modules/province/province.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductModule,
    SettingsModule,
    ProvinceModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
