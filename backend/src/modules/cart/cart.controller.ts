import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(
    @Body() createCartDto: CreateCartItemDto,
    @GetUser('sub') userId: string,
  ) {
    return this.cartService.create(createCartDto, userId);
  }

  @Post('batch')
  createBatch(
    @Body() createCartDto: CreateCartItemDto[],
    @GetUser('sub') userId: string,
  ) {
    return this.cartService.createBatch(createCartDto, userId);
  }

  @Get()
  findAll(@GetUser('sub') userId: string) {
    return this.cartService.findAll(userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartItemDto,
    @GetUser('sub') userId: string,
  ) {
    return this.cartService.update(id, updateCartDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('sub') userId: string) {
    return this.cartService.remove(id, userId);
  }
}
