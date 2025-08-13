import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Put,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import { getDownloadUrl } from 'src/common/helper/url.helper';
import { UpdateStockDto } from 'src/modules/product/dto/update-stock.dto';
import { FindAllDto } from 'src/modules/product/dto/find-all.dto';
import { ExcelHelper } from 'src/common/helper/excel.helper';
import { Response } from 'express';
import { PaginationResultDto } from 'src/common/dto/pagination-result.dto';
import { Product } from 'src/modules/product/schema/product.schema';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Public()
  @Post('find-all')
  async findAll(@Body() dto: FindAllDto) {
    const { items, total } = await this.productService.findAll(dto);
    return new PaginationResultDto<Product>(items, total);
  }

  @Post('export')
  async export(@Body() dto: FindAllDto, @Res() res: Response) {
    const { items } = await this.productService.findAll(dto);
    const exportItems = items.map((item) => ({
      ...item,
      category: item.category?.name || '',
    }));

    return ExcelHelper.exportToExcel(
      exportItems,
      [
        { header: 'ID', key: '_id' },
        { header: 'Name', key: 'name' },
        { header: 'Price', key: 'price' },
        { header: 'Stock', key: 'quantity' },
        { header: 'Category', key: 'category' },
        { header: 'Active', key: 'active' },
      ],
      `product_${new Date().getTime()}.xlsx`,
      res,
    );
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id/active')
  async updateActive(@Param('id') id: string, @Body('active') active: boolean) {
    return this.productService.setActive(id, active);
  }

  @Put(':id/stock')
  async updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.productService.updateStock(id, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/product',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadProductImage(@UploadedFile() image: Express.Multer.File) {
    return { imageUrl: getDownloadUrl(image.path) };
  }
}
