import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/modules/chat/schema/message.schema';
import { Model, Types } from 'mongoose';
import { SendMessageDto } from 'src/modules/chat/dto/send-message.dto';
import { Role } from 'src/modules/users/enums/role.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

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

  async findByUser(query: PaginationQueryDto, userId: string) {
    const filter = { user: new Types.ObjectId(userId) };
    const total = await this.chatModel.countDocuments(filter);

    const items = await this.chatModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(query.offset)
      .limit(query.pageSize)
      .lean()
      .exec();
    return { items, total };
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }
}
