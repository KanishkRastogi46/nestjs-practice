import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Coffees } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
    
    constructor(
        @InjectRepository(Coffees)
        private readonly coffeeRepository: Repository<Coffees>
    ) {}

    async findAll() {
        return await this.coffeeRepository.find()
    }

    async findById(id: number) {
        const coffee = await this.coffeeRepository.findOne({where: {id}})
        if (!coffee) {
            throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);
        }
        return coffee
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const newCoffee = this.coffeeRepository.create(createCoffeeDto)
        return await this.coffeeRepository.save(newCoffee)
    }

    async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
        const coffee = await this.coffeeRepository.preload({
            id,
            ...updateCoffeeDto
        })
        if (!coffee) {
            throw new HttpException('Coffe not found', HttpStatus.NOT_FOUND);
        }
        return await this.coffeeRepository.save(coffee)
    }

    async remove(id: number) {
        const coffee = await this.coffeeRepository.findOne({where: {id}})
        if (!coffee) {
            throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);
        }
        return await this.coffeeRepository.remove(coffee)
    }

}
