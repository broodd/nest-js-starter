import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationReqDto } from '../../dtos/pagination.dto';
import { Chat } from '../../models/chat.model';
import { ChatMessage } from '../../models/chatMessage.model';
import { ChatPartipant } from '../../models/chatPartipant.model';
import { User } from '../../models/user.model';
import { CreateChatReqDto } from './dtos/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat)
    private chatModel: typeof Chat,

    @InjectModel(ChatMessage)
    private chatMessageModel: typeof ChatMessage,

    @InjectModel(ChatPartipant)
    private chatPartipantModel: typeof ChatPartipant,

    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  public async checkIsPartipation(chatId, userId) {
    const isPartipationOfChat = await this.chatPartipantModel.findOne({
      where: {
        chatId,
        userId,
      },
    });

    if (!isPartipationOfChat) {
      throw new BadRequestException('error.chat.youNotPartipation');
    }
  }

  async getChats({ offset, limit }: PaginationReqDto, user: User) {
    return await this.chatModel.findAndCountAll({
      include: [
        {
          model: ChatPartipant,
          attributes: [],
          where: {
            userId: user.id,
          },
        },
      ],
      // offset,
      // limit,
      order: [['updatedAt', 'DESC']],
    });
  }

  async getMessages(
    chatId: number,
    { offset, limit }: PaginationReqDto,
    user: User,
  ) {
    await this.checkIsPartipation(chatId, user.id);

    const { count, rows } = await this.chatMessageModel.findAndCountAll({
      where: {
        chatId,
      },
      // offset,
      // limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      count,
      rows: rows.reverse(),
    };
  }

  async getPartipants(
    chatId: number,
    { offset, limit }: PaginationReqDto,
    user: User,
  ) {
    await this.checkIsPartipation(chatId, user.id);

    return await this.chatPartipantModel.findAndCountAll({
      // offset,
      // limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async createChat({ userIds, name }: CreateChatReqDto, user: User) {
    const chat = await this.chatModel.create({
      name,
    });

    userIds.push(user.id);
    await chat.$add('partipants', userIds);

    return chat.id;
  }

  async addMessage({ chatId, text }, user: User) {
    return await this.chatMessageModel.create({
      chatId,
      userId: user.id,
      text,
    });
  }
}
