import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from '../../models/chat.model';
import { ChatMessage } from '../../models/chatMessage.model';
import { ChatPartipant } from '../../models/chatPartipant.model';
import { User } from '../../models/user.model';
import { UsersModule } from '../users/users.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('accessToken.secret'),
        signOptions: { expiresIn: config.get('accessToken.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Chat, ChatMessage, ChatPartipant, User]),
    UsersModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
