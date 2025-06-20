import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Coffees } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { COFFEE_BRANDS } from './coffees.constant';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Event } from 'src/event/entities/event.entity';

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
        Injecting Event Model to handle events related to coffees.
        */
        @InjectModel(Event.name)
        private readonly eventModel: Model<Event>,

        @InjectConnection()
        private readonly connection: Connection,
        
        @Inject(COFFEE_BRANDS)
        private readonly coffeeBrands: string[],

        private readonly configService: ConfigService,

        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfigType: ConfigType<typeof coffeesConfig>
    ) {
       console.log('Coffee Brands:', this.coffeeBrands);
       console.log(this.coffeesConfigType.description);
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

    async recommendations(coffee: Coffees) {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            coffee.recommendations++;
            const newEvent = new this.eventModel({
                type: 'coffee-recommendation',
                name: coffee.name,
                payload: {
                    coffeeId: coffee._id
                }
            })

            await coffee.save({ session });
            await newEvent.save({ session });

            await session.commitTransaction();
        } catch (error) {
            session.abortTransaction();                        
        } finally {
            session.endSession();
        }
    }
}
