import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(userName: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { userName }, relations: ['role'] });

    if (!user || !user.checkPassword(password)) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload = { username: user.userName, sub: user.id, role: user.role.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        userName: user.userName,
        role: user.role.name
      }
    };
  }
}
