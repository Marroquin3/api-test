import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; 
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { SearchUserDto } from './dto/search-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: createUserDto.roleId },
      });

      if (!role) {
        return {
          ok: false,
          message: 'Rol no encontrado',
          status: 404,
        };
      }

      const existingUser = await this.userRepository.findOne({
        where: { userName: createUserDto.userName },
      });

      if (existingUser) {
        return {
          ok: false,
          message: 'El nombre de usuario ya está en uso',
          status: 409,
        };
      }

      const user = new User();
      user.userName = createUserDto.userName;
      user.password = bcrypt.hashSync(createUserDto.password, 10);
      user.role = role;
      user.active = true;

      await this.userRepository.save(user);

      return {
        ok: true,
        message: 'Usuario creado exitosamente',
        status: 201,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al crear el usuario',
        status: 500,
      };
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        where: { active: true },
        relations: ['role'],
      });

      return {
        ok: true,
        users,
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al obtener usuarios',
        status: 500,
      };
    }
  }

  async findAllFiltered(searchDto: SearchUserDto) {
    try {
      const { page = 1, limit = 5, userName = '', role = '', active = '1' } = searchDto;

      const queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.userName LIKE :userName', { userName: `%${userName}%` });

      if (role) {
        queryBuilder.andWhere('role.name LIKE :role', { role: `%${role}%` });
      }

      if (active === '0' || active === '1') {
        queryBuilder.andWhere('user.active = :active', { active: active === '1' });
      }

      queryBuilder.skip((page - 1) * limit).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        ok: true,
        data,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al filtrar usuarios',
        status: 500,
      };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });

      if (!user) {
        return {
          ok: false,
          message: 'Usuario no encontrado',
          status: 404,
        };
      }

      return {
        ok: true,
        user,
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al obtener usuario',
        status: 500,
      };
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return {
          ok: false,
          message: 'Usuario no encontrado',
          status: 404,
        };
      }

      if (updateUserDto.password) {
        const salt = bcrypt.genSaltSync(10);
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, salt);
      }

      Object.assign(user, updateUserDto);
      await this.userRepository.save(user);

      return {
        ok: true,
        message: 'Usuario actualizado correctamente',
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al actualizar usuario',
        status: 500,
      };
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return {
          ok: false,
          message: 'Usuario no encontrado',
          status: 404,
        };
      }

      user.active = false;
      await this.userRepository.save(user);

      return {
        ok: true,
        message: 'Usuario desactivado correctamente',
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Error al eliminar usuario',
        status: 500,
      };
    }
  }
}
