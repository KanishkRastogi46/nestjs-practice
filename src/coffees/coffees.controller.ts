import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
    constructor (private readonly coffeesService: CoffeesService) {}
    
    @Get(":coffeeType")
    findAll(@Param('coffeeType') param) {
        return `Return the coffee type: ${param}`
    }

    @Post("")
    @HttpCode(HttpStatus.OK)
    getData(@Body() body) {
        return body
    }

    @Patch(":id")
    update(@Param("id") id:String, @Body() body) {
        return `This will make changes to body with id: ${id}`
    }

    @Delete(":id")
    remove(@Param("id") id:string) {
        return `Delete item with id: ${id}`
    }

    @Get("/pages/curr")
    @HttpCode(HttpStatus.OK)
    paginate(@Query('limit') limit, @Query('offset') offset) {
        return `Limit is ${limit} and offset is ${offset}`
    }
}
