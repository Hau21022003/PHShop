import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { getDownloadUrl } from 'src/common/helper/url.helper';
import { ChatService } from 'src/modules/chat/chat.service';
import { FindByUserDto } from 'src/modules/chat/dto/find-by-user.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('my')
  findMine(@Body() query: PaginationQueryDto, @GetUser('sub') userId: string) {
    return this.chatService.findByUser(query, userId);
  }

  @UseGuards(AdminGuard)
  @Post('by-user')
  findByUserId(@Body() query: FindByUserDto) {
    return this.chatService.findByUser(query, query.userId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/chat',
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
