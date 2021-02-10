import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { RefreshToken } from './refreshToken.model';

@Table
export class User extends Model {
  @Column
  firebaseId: string;

  @HasMany(() => RefreshToken)
  refreshTokens: RefreshToken;
}
