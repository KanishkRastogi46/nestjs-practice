import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

@Module({
    imports: [],
    // exports: [CoffeesController, CoffeesService],
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule {}
