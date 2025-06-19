import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeDto {
    @ApiProperty({
        description: 'The name of the coffee',
        example: 'Espresso',
    })
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'The brand of the coffee',
        example: 'Coffee Co.',
    })
    @IsString()
    readonly brand: string;

    @ApiProperty({
        description: 'The flavors of the coffee',
        example: ['chocolate', 'vanilla'],
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    readonly flavours: string[];
}
