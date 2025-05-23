import { IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateCoffeeDto {
    @IsNumber()
    readonly id: number;

    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;

    @IsArray()
    @IsString({ each: true })
    readonly flavors: string[];
}
