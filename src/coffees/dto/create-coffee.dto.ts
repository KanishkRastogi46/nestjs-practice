import { IsArray, IsString } from 'class-validator';
import { Flavours } from '../entities/flavour.entity';

export class CreateCoffeeDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;

    @IsArray()
    @IsString({ each: true })
    readonly flavours: string[];
}
