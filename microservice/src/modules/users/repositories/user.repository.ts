import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';

@Injectable()
export class UserRepository extends Repository<Users> {
  constructor(
    @InjectRepository(Users)
    private readonly repository: Repository<Users>,
  ) {
    super(Users, repository.manager, repository.queryRunner);
  }

  async findByPK(id: number): Promise<Users | null> {
    return this.repository.findOne({
      where: { id, status: 'ACTIVE' },
    });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.findOne({ where: { email } });
  }
}