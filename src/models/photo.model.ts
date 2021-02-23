import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Photo extends Model {
  @Column
  src: string;

  @ForeignKey(() => User)
  @Column
  authorId: number;

  @BelongsTo(() => User)
  author: User;
}
