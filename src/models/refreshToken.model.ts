import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class RefreshToken extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  token: string;

  @Column
  expireAt: Date;
}
