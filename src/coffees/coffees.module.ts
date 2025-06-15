import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffees } from './entities/coffee.entity';
import { Flavours } from './entities/flavour.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coffees,
            Flavours,
            Event
        ])
    ],
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule {}
