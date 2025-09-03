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

  async markAllAsRead(userId: string, fromRole: Role) {
    const filter = {
      user: new Types.ObjectId(userId),
      fromRole,
      isRead: false,
    };

    const result = await this.chatModel.updateMany(filter, {
      $set: { isRead: true },
    });

    return {
      modifiedCount: result.modifiedCount,
    };
  }

  async countUnreadMessages(fromRole: Role, userId?: string) {
    const filter: Record<string, any> = {
      fromRole,
      isRead: false,
    };
    if (userId) {
      filter.user = new Types.ObjectId(userId);
    }
    const count = await this.chatModel.countDocuments(filter);
    return { count };
  }

  async getConversations() {
    return this.chatModel
      .aggregate([
        // Sắp xếp theo thời gian mới nhất trước
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$user', // gom theo user
            latestMessage: { $first: '$$ROOT' }, // lấy message mới nhất
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$fromRole', Role.USER] },
                      { $eq: ['$isRead', false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            let: { userId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
              { $match: { role: Role.USER } }, // chỉ lấy user có role USER
            ],
            as: 'user',
          },
        },
        { $unwind: '$user' }, // flatten user object
        {
          $project: {
            _id: 0,
            user: {
              _id: '$user._id',
              fullName: '$user.contactDetails.fullName',
              email: '$user.email',
            },
            latestMessage: {
              _id: '$latestMessage._id',
              message: '$latestMessage.message',
              fromRole: '$latestMessage.fromRole',
              isRead: '$latestMessage.isRead',
              createdAt: '$latestMessage.createdAt',
            },
            unreadCount: 1,
          },
        },
        { $sort: { 'latestMessage.createdAt': -1 } }, // sắp xếp theo thời gian mới nhất
      ])
      .exec();
  }

  remove(id: string) {
    return `This action removes a #${id} chat`;
  }
}
