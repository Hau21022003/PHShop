import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { getDownloadUrl } from 'src/common/helper/url.helper';
import { FindByProductDto } from 'src/modules/review/dto/search.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { FindAllDto } from 'src/modules/review/dto/find-all.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ReplyDto } from 'src/modules/review/dto/reply.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto,
    @GetUser('sub') userId: string,
  ) {
    return this.reviewService.create(createReviewDto, userId);
  }

  @Public()
  @Post('find-by-product')
  async findByProduct(@Body() dto: FindByProductDto) {
    const summary = await this.reviewService.buildSummary(dto.productId);
    const items = await this.reviewService.findByProduct(dto);
    return { summary, items };
    // return this.reviewService.findByProduct(dto);
  }

  @UseGuards(AdminGuard)
  @Post('find-all')
  findAll(@Body() query: FindAllDto) {
    return this.reviewService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Public()
  @Get(':productId/find-summary')
  async findSummaryByProduct(@Param('productId') productId: string) {
    const summary = await this.reviewService.buildSummary(productId);
    return { summary };
  }

  @Get(':orderId/find-by-order')
  findOneByOrder(@Param('orderId') orderId: string) {
    return this.reviewService.findOneByOrder(orderId);
  }

  @Put(':id/reply')
  reply(@Param('id') id: string, @Body() dto: ReplyDto) {
    return this.reviewService.reply(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/review',
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
