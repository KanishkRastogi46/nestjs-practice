import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Coffees } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
    private coffees: Coffees[] = [
        {
            id: 1,
            name: 'Arabica',
            brand: 'Nestle',
            flavors: ['chocolate', 'vanilla'],
        },
        {
            id: 2,
            name: 'Robusta',
            brand: 'Nescafe',
            flavors: ['caramel', 'cinnamon'],
        },
    ]

    findAll() {
        return this.coffees;
    }

    findById(id: number) {
        return this.coffees.find((coffee) => coffee.id === id);
    }

    create(coffee: Coffees) {
        this.coffees.push(coffee);
    }

    update(id: number, coffee: Coffees) {
        const index = this.coffees.findIndex((coffee) => coffee.id === id);
        if (index == -1) {
            throw new HttpException('Coffe not found', HttpStatus.NOT_FOUND);
        }
        this.coffees[index] = coffee;
    }

    remove(id: number) {
        const index = this.coffees.findIndex((coffee) => coffee.id === id);
        if (index != -1) {
            this.coffees.splice(index, 1);
        }
    }

}
