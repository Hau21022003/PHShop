import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/modules/chat/schema/message.schema';
import { Model } from 'mongoose';
import { SendMessageDto } from 'src/modules/chat/dto/send-message.dto';
import { Role } from 'src/modules/users/enums/role.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private chatModel: Model<Message>,
  ) {}

  create(query: SendMessageDto, userId: string, role: Role) {
    const messageData = {
      user: userId,
      fromRole: role,
      ...query,
    };
    const created = new this.chatModel(messageData);
    return created.save();
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }
}
