import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffees } from './entities/coffee.entity';
import { Flavours } from './entities/flavour.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { NotFoundError } from 'rxjs';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class CoffeesService {
    
    constructor(
        @InjectRepository(Coffees)
        private readonly coffeeRepository: Repository<Coffees>,
        @InjectRepository(Flavours)
        private readonly flavourRepository: Repository<Flavours>,
        private readonly connection: Connection
    ) {}

    async findAll(query: PaginationQuery) {
        try {
            return await this.coffeeRepository.find({
                order: {
                    id: 'ASC'
                },
                take: query.limit || 2,
                skip: query.offset || 0
            })
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);            
        }
    }

    async findById(id: number) {
        try {
            const coffee = await this.coffeeRepository.findOne({where: {id}, relations: ['flavours']})
            if (!coffee) {
                throw new NotFoundException(`Coffee with ID ${id} not found`);
            }
            return coffee
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);            
        }
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        try {
            const flavours = await Promise.all(
                createCoffeeDto.flavours.map(flavourName => this.preloadFlavoursByNames(flavourName))
            );
            const newCoffee = this.coffeeRepository.create(
                { 
                    ...createCoffeeDto, 
                    flavours 
                }
            )
            return await this.coffeeRepository.save(newCoffee)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);                       
        }
    }

    async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
        try {
            const flavours = updateCoffeeDto.flavours && await Promise.all(
                updateCoffeeDto.flavours.map(flavourName => this.preloadFlavoursByNames(flavourName))
            );
            const coffee = await this.coffeeRepository.preload({
                id,
                ...updateCoffeeDto,
                flavours
            })
            if (!coffee) {
                throw new NotFoundException(`Coffee with ID ${id} not found`);
            }
            return await this.coffeeRepository.save(coffee)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);            
        }
    }

    async remove(id: number) {
        try {
            const coffee = await this.coffeeRepository.findOne({where: {id}})
            if (!coffee) {
                throw new NotFoundException(`Coffee with ID ${id} not found`);
            }
            return await this.coffeeRepository.remove(coffee)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);                        
        }
    }

    private async preloadFlavoursByNames(name: string) {
        try {
            const existingFlavour = await this.flavourRepository.findOne({
                where: { name }
            })
            if (existingFlavour) {
                return existingFlavour;
            }
            return this.flavourRepository.create({ name });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);                        
        }
    }

    async recommendations(coffee: Coffees) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;

            const recommendedEvent = new Event();
            recommendedEvent.type = "recommend_coffee";
            recommendedEvent.name = coffee.name;
            recommendedEvent.payload = { coffeeId: coffee.id, recommendations: coffee.recommendations };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendedEvent);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            queryRunner.release();
        }
    }
}
