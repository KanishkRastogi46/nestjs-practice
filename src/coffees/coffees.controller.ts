import { Body,
    Controller,
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param,
    Patch, 
    Post, 
    Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from 'src/common/pipes/int-parse.pipe';
import { ProtocolDecorator } from 'src/common/decorators/protocol.decorator';

@Controller('coffees')
export class CoffeesController {
    constructor (private readonly coffeesService: CoffeesService) {}
    
    @Public()
    @Get("")
    findAll(@ProtocolDecorator('https') protocol: string, @Query() query: PaginationQuery) {
        console.log(`Protocol used: ${protocol}`);
        return this.coffeesService.findAll(query);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    getData(@Param("id") id: string) {
        return this.coffeesService.findById(id);
    }

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCoffee: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffee);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateCoffee: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffee);
    }

    @Delete(":id")
    remove(@Param("id") id:string) {
        return this.coffeesService.remove(id);
    }
}
