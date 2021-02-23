import {
  BelongsTo,
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ChatMessage } from './chatMessage.model';
import { ChatPartipant } from './chatPartipant.model';
import { User } from './user.model';

@Table
export class Chat extends Model {
  @Column
  name: string;

  @Column
  lastMessageId: number;

  @BelongsTo(() => ChatMessage, {
    foreignKey: 'lastMessageId',
    constraints: false,
  })
  lastMessage: ChatMessage;

  @BelongsToMany(
    () => User,
    () => ChatPartipant,
  )
  partipants: User[];

  @HasMany(() => ChatPartipant)
  chatPartipants: ChatPartipant[];
}
