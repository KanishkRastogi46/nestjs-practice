import { Module } from '@nestjs/common';
import { HashingService } from './providers/hashing.service';
import { BcryptService } from './providers/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      User
    ])
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService
    },
    AuthenticationService
  ],
  controllers: [AuthenticationController]
})
export class IamModule {}
