import { Body,
    Controller,
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {
    constructor (private readonly coffeesService: CoffeesService) {}
    
    @Get("")
    findAll(@Query() query: PaginationQuery) {
        return this.coffeesService.findAll(query);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    getData(@Param("id", ParseIntPipe) id: number) {
        return this.coffeesService.findById(id);
    }

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCoffee: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffee);
    }

    @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() updateCoffee: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffee);
    }

    @Delete(":id")
    remove(@Param("id") id:string) {
        return this.coffeesService.remove(Number(id));
    }
}
