import { UseGuards, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/modules/chat/chat.service';
import { GetWsUser } from 'src/modules/chat/decorators/get-ws-user.decorator';
import { SendMessageDto } from 'src/modules/chat/dto/send-message.dto';
import { WsJwtGuard } from 'src/modules/chat/guards/ws-jwt.guard';
import { Role } from 'src/modules/users/enums/role.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // private readonly chatService: ChatService;
  constructor(private readonly chatService: ChatService) {}

  // Lưu userId <-> socketId, role
  private activeUsers = new Map<string, { socketIds: string[]; role: Role }>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, { socketIds, role }] of this.activeUsers.entries()) {
      const index = socketIds.indexOf(client.id);
      if (index !== -1) {
        socketIds.splice(index, 1);
        if (socketIds.length === 0) {
          this.activeUsers.delete(userId);
        }
        break;
      }
    }

    console.log('handleDisconnect', this.activeUsers);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @GetWsUser('sub') userId: string,
    @GetWsUser('role') role: Role,
  ) {
    const existing = this.activeUsers.get(userId);
    if (existing) {
      existing.socketIds.push(client.id);
    } else {
      this.activeUsers.set(userId, { socketIds: [client.id], role });
    }

    if (role === Role.ADMIN) {
      client.join('admins');
    }

    console.log(`Registered ${userId} (${role}) with socket ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody(new ValidationPipe({ transform: true }))
    data: SendMessageDto,
    @GetWsUser('sub') userId: string,
    @GetWsUser('role') role: Role,
    @ConnectedSocket() client: Socket,
  ) {
    if (role === Role.USER) {
      const message = await this.chatService.create(data, userId, role);
      // User → gửi tới tất cả admin trong "admins"
      this.server.to('admins').emit('receive_message', message);
      client.emit('message_confirmed', message);
    } else if (role === Role.ADMIN && data.toUserId) {
      // Admin → gửi tới user cụ thể
      const user = this.activeUsers.get(data.toUserId);
      if (user) {
        const message = await this.chatService.create(
          data,
          data.toUserId,
          role,
        );
        this.server.to(user.socketIds).emit('receive_message', message);
        this.server.to('admins').emit('admin_message', message);
      }
    }
  }
}
