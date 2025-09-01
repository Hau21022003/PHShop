import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from 'src/modules/chat/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/modules/chat/schema/message.schema';
import { ChatController } from 'src/modules/chat/chat.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
