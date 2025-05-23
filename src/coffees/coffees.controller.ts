import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
    constructor (private readonly coffeesService: CoffeesService) {}
    
    @Get("")
    findAll() {
        return this.coffeesService.findAll();
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    getData(@Param("id") id: string) {
        return this.coffeesService.findById(Number(id));
    }

    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCoffee: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffee);
    }

    @Patch(":id")
    update(@Param("id") id:String, @Body() updateCoffee: UpdateCoffeeDto) {
        return this.coffeesService.update(Number(id), updateCoffee);
    }

    @Delete(":id")
    remove(@Param("id") id:string) {
        return this.coffeesService.remove(Number(id));
    }
}
