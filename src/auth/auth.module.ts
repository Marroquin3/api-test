import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm'; // Necesario para usar repositories
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity'; // Asegúrate que esta ruta sea correcta

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Importa el repositorio de User
    JwtModule.register({
      secret: '29da78226dd11fe5ceb431cec8170078853e834e3a934b235db22ea8d36ad663',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
