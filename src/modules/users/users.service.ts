import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PaginationReqDto } from '../../dtos/pagination.dto';
import { User } from '../../models/user.model';
import { CacheService } from '../cache/сache.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    private cacheService: CacheService,
  ) {}

  public async byId(id: number) {
    const key = `user:${id}`;
    const cached = await this.cacheService.get(key);

    try {
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {}

    const user = await this.userModel.findByPk(id);
    this.cacheService.set(key, JSON.stringify(user));

    return user;
  }

  async getUsers({ offset, limit }: PaginationReqDto, user: User) {
    return await this.userModel.findAndCountAll({
      where: {
        id: {
          [Op.not]: user.id,
        },
      },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
  }
}
