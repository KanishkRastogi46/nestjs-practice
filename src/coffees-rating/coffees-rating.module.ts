import { Module } from '@nestjs/common';
import { CoffeesRatingService } from './coffees-rating.service';
import { CoffeesRatingController } from './coffees-rating.controller';

@Module({
  providers: [CoffeesRatingService],
  controllers: [CoffeesRatingController]
})
export class CoffeesRatingModule {}
