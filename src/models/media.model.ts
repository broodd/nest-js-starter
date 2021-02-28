import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Media extends Model {
  @Column
  srcSmall: string;

  @Column
  srcMedium: string;

  @Column
  src: string;

  @Column
  type: string;

  @Column
  extension: string;

  @Column
  originalName: string;

  @Column
  size: number;

  @ForeignKey(() => User)
  @Column
  authorId: number;

  @BelongsTo(() => User)
  author: User;
}
