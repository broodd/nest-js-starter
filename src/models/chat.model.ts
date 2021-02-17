import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ChatPartipant } from './chatPartipant.model';
import { User } from './user.model';

@Table
export class Chat extends Model {
  @Column
  name: string;

  @BelongsToMany(
    () => User,
    () => ChatPartipant,
  )
  partipants: User[];

  @HasMany(() => ChatPartipant)
  chatPartipants: ChatPartipant[];
}
