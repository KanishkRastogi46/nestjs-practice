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
    Req,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/int-parse.pipe';
import { ProtocolDecorator } from 'src/common/decorators/protocol.decorator';
import { Request } from 'express';
import { AuthDecorator } from 'src/iam/authentication/decorators/auth-type.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user.interface';

@AuthDecorator(AuthType.Bearer)
@Controller('coffees')
export class CoffeesController {
    constructor (private readonly coffeesService: CoffeesService) {}
    
    @Get("")
    findAll(
        @ProtocolDecorator('https') protocol: string, 
        @Query() query: PaginationQuery,
        @ActiveUser() user: ActiveUserData
    ) {
        console.log(`Sub: ${user.sub}, Email: ${user.email}`); 
        console.log(`Protocol used: ${protocol}`);
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
