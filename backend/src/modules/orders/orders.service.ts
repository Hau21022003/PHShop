import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ShippingFeeDto } from 'src/modules/orders/dto/shipping-fee.dto';
import { HttpService } from '@nestjs/axios';
import { SettingsService } from 'src/modules/settings/settings.service';
import { SettingKey } from 'src/modules/settings/enum/setting-key.enum';
import { ProductService } from 'src/modules/product/product.service';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/modules/orders/schema/order.chema';
import { Model } from 'mongoose';
import { ProductSnapshot } from 'src/modules/cart/schema/cart.schema';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly settingsService: SettingsService,
    private readonly productService: ProductService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async calcShippingFee(dto: ShippingFeeDto) {
    // const url = '/services/shipment/fee'; // Thay URL API của bạn vào đây
    // // const response = await firstValueFrom(this.httpService.get(url));
    // const response = await this.httpService.get(url, {
    //   headers: { 'Authorization': `Bearer YOUR_TOKEN` },
    // });
    // console.log(response)
    const freeShippingThreshold: number = await this.settingsService.get(
      SettingKey.FREE_SHIPPING,
    );

    const subTotal = await dto.items.reduce(async (sumPromise, item) => {
      const sum = await sumPromise;
      const product = await this.productService.findOne(item.product);
      return sum + item.quantity * product.price;
    }, Promise.resolve(0));

    if (subTotal > freeShippingThreshold) {
      return 0;
    }

    return 15_000;
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.buildOrderData(createOrderDto);
    const created = new this.orderModel(order);
    return created.save();
  }

  private async buildOrderData(dto: CreateOrderDto) {
    const deliveryPrice = await this.calcShippingFee({
      items: dto.items,
      districtId: dto.contactDetails.district,
      provinceId: dto.contactDetails.province,
      wardId: dto.contactDetails.ward,
    });
    const subTotal = await this.getSubtotal(dto.items);
    return {
      ...dto,
      deliveryPrice,
      totalAmount: subTotal + deliveryPrice,
      items: await Promise.all(
        dto.items.map(async (item) => {
          const product = await this.productService.findOne(item.product);
          const productSnapshot: ProductSnapshot = {
            image: product.images.length !== 0 ? product.images[0] : '',
            name: product.name,
            price: product.price,
            discount: product.discount,
          };
          return { ...item, productSnapshot };
        }),
      ),
    };
  }

  private getSubtotal(orderItems: OrderItemDto[]) {
    const total = orderItems.reduce(async (sumPromise, orderItem) => {
      const sum = await sumPromise;
      const product = await this.productService.findOne(orderItem.product);
      const variantProduct = product?.variants?.find((variant) =>
        this.isSameAttributes(
          variant.attributes || [],
          orderItem.attributeVariant || [],
        ),
      );
      const price = variantProduct?.price || product?.price || 0;
      return (
        sum +
        this.getPriceDiscount(
          orderItem.quantity * price,
          product?.discount || 0,
        )
      );
    }, Promise.resolve(0));
    return total;
  }

  private getPriceDiscount(price: number, discount: number) {
    const rawPriceDiscount =
      price && discount ? price - (price * discount) / 100 : price;
    const priceDiscount = rawPriceDiscount
      ? Number(rawPriceDiscount.toFixed(2))
      : 0;
    return priceDiscount;
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

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
