import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ShippingFeeDto } from 'src/modules/orders/dto/shipping-fee.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FindAllDto } from 'src/modules/orders/dto/find-all.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from 'src/modules/users/enums/role.enum';
import { OrderStatus } from 'src/modules/orders/enum/status.enum';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Response } from 'express';
import { ExcelHelper } from 'src/common/helper/excel.helper';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('find-all')
  findAll(
    @Body() query: FindAllDto,
    @GetUser('sub') userId: string,
    @GetUser('role') role: Role,
  ) {
    return this.ordersService.findAll(query, userId, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get(':id/check-stock')
  checkStock(@Param('id') id: string) {
    return this.ordersService.checkStock(id);
  }

  @Get(':id/confirm')
  @UseGuards(AdminGuard)
  confirmOrder(@Param('id') id: string) {
    return this.ordersService.confirmOrder(id);
  }

  @Get(':id/ship')
  @UseGuards(AdminGuard)
  shipOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.SHIPPED);
  }

  @Get(':id/deliver')
  @UseGuards(AdminGuard)
  deliverOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.DELIVERED);
  }

  @Get(':id/cancel')
  @UseGuards(AdminGuard)
  cancelOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.CANCEL);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Public()
  @Post('shipping-fee')
  async calcShippingFee(@Body() dto: ShippingFeeDto) {
    const shippingFee = await this.ordersService.calcShippingFee(dto);
    return { shippingFee };
  }

  @Post('export')
  async export(
    @Body() query: FindAllDto,
    @GetUser('sub') userId: string,
    @GetUser('role') role: Role,
    @Res() res: Response,
  ) {
    const { items } = await this.ordersService.findAll(query, userId, role);
    const exportItems = items.map((item) => ({
      ...item,
      contactName: item.contactDetails.fullName,
      contactPhone: item.contactDetails.phoneNumber,
      productsSummary: item.items
        .map((orderItem) => {
          const attribute =
            orderItem.attributeVariant?.length !== 0
              ? orderItem.attributeVariant.reduce(
                  (acc, attribute, idx) =>
                    idx !== 0
                      ? acc + `, ${attribute.title} - ${attribute.option}`
                      : `${attribute.title} - ${attribute.option}`,
                  '',
                )
              : '';
          return attribute !== ''
            ? `${orderItem.productSnapshot.name}; ${attribute}; x${orderItem.quantity}`
            : `${orderItem.productSnapshot.name}; x${orderItem.quantity}`;
        })
        .join('. '),
    }));

    return ExcelHelper.exportToExcel(
      exportItems,
      [
        { header: 'Code', key: 'code' },
        { header: 'Name', key: 'name' },
        { header: 'Total Price', key: 'totalAmount' },
        { header: 'Delivery Price', key: 'deliveryPrice' },
        { header: 'Status', key: 'status' },
        { header: 'Note', key: 'note' },
        { header: 'Customer Name', key: 'contactName' },
        { header: 'Customer Phone', key: 'contactPhone' },
        { header: 'Created date', key: 'createdAt' },
        { header: 'Products', key: 'productsSummary' },
      ],
      `orders_${new Date().getTime()}.xlsx`,
      res,
    );
  }

  @Get(':id/pdf')
  async getInvoicePdf(@Param('id') id: string, @Res() res: Response) {
    const order = await this.ordersService.findOne(id);
    const orderData = this.ordersService.mapContactDetails(order);
    const formattedOrder = {
      ...orderData,
      formattedTotalAmount: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(orderData.totalAmount),
    };

    const pdfBuffer = await this.ordersService.generateInvoice(formattedOrder);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=invoice-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
