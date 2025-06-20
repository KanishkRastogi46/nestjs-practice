import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeesRatingModule } from './coffees-rating/coffees-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import * as Joi from '@hapi/joi';
import appConfig from './config/app.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
      load: [appConfig]
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CoffeesModule,
    CoffeesRatingModule, 
    DatabaseModule, 
    CommonModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
