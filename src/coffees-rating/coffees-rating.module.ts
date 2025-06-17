import { Module } from '@nestjs/common';
import { CoffeesRatingService } from './coffees-rating.service';
import { CoffeesRatingController } from './coffees-rating.controller';
import { CoffeesModule } from 'src/coffees/coffees.module';

@Module({
  imports: [
    CoffeesModule
  ],
  providers: [CoffeesRatingService],
  controllers: [CoffeesRatingController]
})
export class CoffeesRatingModule {}
