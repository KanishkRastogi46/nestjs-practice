import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffees, CoffeeSchema } from './entities/coffee.entity';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Coffees.name,
                schema: CoffeeSchema
            }
        ]),
        ConfigModule.forFeature(coffeesConfig)
    ],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        {
            provide: 'COFFEE_BRANDS',
            useFactory: () => ['Buddy Brew', 'Blue Bottle', 'Drip'],
        }
    ],
    exports: [CoffeesService]
})
export class CoffeesModule {}
