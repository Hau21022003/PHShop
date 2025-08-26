import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { ShippingFeeDto } from 'src/modules/orders/dto/shipping-fee.dto';
import { HttpService } from '@nestjs/axios';
import { SettingsService } from 'src/modules/settings/settings.service';
import { SettingKey } from 'src/modules/settings/enum/setting-key.enum';
import { ProductService } from 'src/modules/product/product.service';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/modules/orders/schema/order.schema';
import { Model } from 'mongoose';
import { ProductSnapshot } from 'src/modules/cart/schema/cart.schema';
import { DateFilter, FindAllDto } from 'src/modules/orders/dto/find-all.dto';
import { Role } from 'src/modules/users/enums/role.enum';
import { ProvinceService } from 'src/modules/province/province.service';
import { OrderStatus } from 'src/modules/orders/enum/status.enum';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { SearchOrderDto } from 'src/modules/orders/dto/search-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly settingsService: SettingsService,
    private readonly productService: ProductService,
    private readonly provinceService: ProvinceService,
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
      code: await this.generateOrderCode(),
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

  private async generateOrderCode(): Promise<string> {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = 'ORD-' + today;

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const lastOrder = await this.orderModel
      .findOne({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    let nextNumber = 1;
    if (lastOrder?.code) {
      const parts = lastOrder.code.split('-');
      const lastNumber = parseInt(parts[2], 10);
      nextNumber = lastNumber + 1;
    }

    const number = String(nextNumber).padStart(3, '0');
    return `${prefix}-${number}`;
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

  async findAll(query: FindAllDto, userId: string, role: Role) {
    const filter = this.buildFilter(query, userId, role);
    const summary = await this.buildSummary(userId, role);

    const total = await this.orderModel.countDocuments(filter);

    const orders = await this.orderModel
      .find(filter)
      .skip(query.offset)
      .limit(query.pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const items = orders.map((order) => this.mapContactDetails(order));

    return { items, total, summary };
  }

  private buildFilter(query: FindAllDto, userId: string, role: Role) {
    const filter: any = {};

    if (role === Role.USER) filter.user = userId;
    if (query.status) filter.status = query.status;

    if (query.dateFilter) {
      const { start, end } = this.mapDateFilter(query.dateFilter);
      if (start || end) {
        filter.createdAt = {};
        if (start) filter.createdAt.$gte = start;
        if (end) filter.createdAt.$lte = end;
      }
    }

    if (query.search) {
      const regex = new RegExp(query.search, 'i');
      filter.$or = [
        { code: regex },
        { note: regex },
        { 'contactDetails.fullName': regex },
        { 'contactDetails.phoneNumber': regex },
        { 'contactDetails.address': regex },
        { 'items.productSnapshot.name': regex },
      ];
    }

    return filter;
  }

  private async buildSummary(userId: string, role: Role) {
    const summaryAgg = await this.orderModel.aggregate([
      { $match: role === Role.USER ? { user: userId } : {} },
      { $group: { _id: '$status', total: { $sum: 1 } } },
    ]);

    return summaryAgg.reduce(
      (acc, cur) => {
        acc[cur._id] = cur.total;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  mapContactDetails(order: any) {
    const { contactDetails } = order;
    return {
      ...order,
      contactDetails: {
        ...contactDetails,
        province: this.provinceService.findOneProvince(contactDetails.province)
          ?.name,
        district: this.provinceService.findOneDistrict(contactDetails.district)
          ?.name,
        ward: this.provinceService.findOneWard(contactDetails.ward)?.name,
      },
    };
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

  async checkStock(orderId: string) {
    const order = await this.findOne(orderId);
    const checks = await Promise.all(
      order.items.map(async (orderItem) => {
        const product = await this.productService.findOne(
          orderItem.product.toString(),
        );
        let selectedVariantStock = product.quantity || 0;
        // Tìm variant của product để lấy ra stock của variant đó
        if (orderItem.attributeVariant?.length !== 0) {
          const selectedAttributes = orderItem.attributeVariant || [];
          const selectedVariant = product.variants.find((variant) =>
            this.productService.isSameAttributes(
              variant.attributes,
              selectedAttributes,
            ),
          );
          selectedVariantStock = selectedVariant?.quantity || 0;
        }
        return orderItem.quantity <= selectedVariantStock;
      }),
    );
    const checkStock = checks.every(Boolean);
    return { checkStock };
  }

  async findOne(id: string) {
    const product = await this.orderModel.findById(id).lean().exec();

    if (!product) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return product;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const updated = await this.orderModel.findByIdAndUpdate(
      id,
      {
        $set: { status },
        $push: { statusHistory: { status, changedAt: new Date() } },
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.orderModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return deleted;
  }

  async confirmOrder(orderId: string) {
    const order = await this.findOne(orderId);
    const checkStock = await this.checkStock(orderId);
    if (!checkStock)
      throw new BadRequestException(
        'Cannot confirm this order because stock is unavailable.',
      );
    for (const item of order.items) {
      await this.productService.decreaseStock(
        item.product.toString(),
        item.quantity,
        item.attributeVariant,
      );
    }
    return await this.updateStatus(orderId, OrderStatus.PROCESSING);
  }

  async generateInvoice(orderData: any) {
    // 1. Load template HTML
    const templatePath = path.join(__dirname, 'templates', 'invoice.hbs');
    const templateFile = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateFile);

    // 2. Inject data vào HTML
    const html = template(orderData);

    // 3. Render PDF bằng Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return pdfBuffer;
  }

  async searchOrder(dto: SearchOrderDto) {
    const order = await this.orderModel
      .findOne({
        code: dto.code,
        'contactDetails.phoneNumber': dto.phoneNumber,
      })
      .lean()
      .exec();

    if (!order) {
      throw new NotFoundException(
        `Order with code ${dto.code} and contact phone ${dto.phoneNumber} not found`,
      );
    }
    return this.mapContactDetails(order);
  }
}
