import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Coffees } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { COFFEE_BRANDS } from './coffees.constant';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoffeesService {
    
    constructor(
        /*
        Injecting the repositories for Coffees and Flavours entities.
        This allows us to perform CRUD operations on these entities using TypeORM.
        */
        @InjectModel(Coffees.name)
        private readonly coffeeModel: Model<Coffees>,
        // @InjectRepository(Flavours)
        // private readonly flavourRepository: Repository<Flavours>,

        /*
        Injecting the DataSource to manage transactions.
        This is useful for operations that require multiple database actions to be executed atomically.
        */
        
        @Inject(COFFEE_BRANDS)
        private readonly coffeeBrands: string[],

        private readonly configService: ConfigService,

        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfigType: ConfigType<typeof coffeesConfig>
    ) {
       console.log('Coffee Brands:', this.coffeeBrands);
       console.log(coffeesConfigType.description);
    }

    async findAll(query: PaginationQuery) {
        try {
            return await this.coffeeModel.find().limit(query.limit || 2).skip(query.offset || 0).exec();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);            
        }
    }

    async findById(id: string) {
        try {
            const coffee = await this.coffeeModel.findOne({ _id: id}).exec();
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
            const newCoffee = new this.coffeeModel(createCoffeeDto)
            return await newCoffee.save()
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);                       
        }
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        try {
            const updatedCoffee = await this.coffeeModel.findOneAndUpdate(
                { _id: id }, 
                { ...updateCoffeeDto }, 
                { new: true, runValidators: true } // Return the updated document and run validation
            )
            .exec()
            if (!updatedCoffee) {
                throw new NotFoundException(`Coffee with ID ${id} not found`);
            }
            return updatedCoffee;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);            
        }
    }

    async remove(id: string) {
        try {
            const deletedCoffee = await this.coffeeModel.findOneAndDelete({ _id: id }).exec();
            if (!deletedCoffee) {
                throw new NotFoundException(`Coffee with ID ${id} not found`);
            }
            return deletedCoffee;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);                        
        }
    }

}
