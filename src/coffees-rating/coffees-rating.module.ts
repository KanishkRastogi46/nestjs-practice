import { Module } from '@nestjs/common';
import { CoffeesRatingService } from './coffees-rating.service';
import { CoffeesRatingController } from './coffees-rating.controller';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    CoffeesModule,
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      synchronize: true,
    })
  ],
  providers: [CoffeesRatingService],
  controllers: [CoffeesRatingController]
})
export class CoffeesRatingModule {}
