import {
  Body,
  Controller,
  Get,
  Param,
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
import { Role } from 'src/modules/users/enums/role.enum';

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

  @Get('read-all/admin')
  markAllAdminMessagesRead(@GetUser('sub') userId: string) {
    return this.chatService.markAllAsRead(userId, Role.ADMIN);
  }

  @UseGuards(AdminGuard)
  @Get('read-all/user/:userId')
  markAllUserMessagesRead(@Param('userId') userId: string) {
    return this.chatService.markAllAsRead(userId, Role.USER);
  }

  @UseGuards(AdminGuard)
  @Get('conversations')
  getConversations() {
    return this.chatService.getConversations();
  }

  @UseGuards(AdminGuard)
  @Get('unread-count/user')
  countUserUnreadMessages() {
    return this.chatService.countUnreadMessages(Role.USER);
  }

  @Get('unread-count/admin')
  countAdminUnreadMessages(@GetUser('sub') userId: string) {
    return this.chatService.countUnreadMessages(Role.ADMIN, userId);
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
