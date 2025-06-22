import { Module } from '@nestjs/common';
import { HashingService } from './providers/hashing.service';
import { BcryptService } from './providers/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokensIdsStorage } from './authentication/refresh-tokens-ids.storage';
import { RolesGuard } from './authorization/guards/roles.guard';
import { PermissionGuard } from './authorization/guards/permissions.guard';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      User
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    },
    AccessTokenGuard,
    AuthenticationService,
    RefreshTokensIdsStorage
  ],
  controllers: [AuthenticationController]
})
export class IamModule {}
