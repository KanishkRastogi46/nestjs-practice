import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    let val: number = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`Validation failed. "${value}" is not an integer.`);
    }

    if (!isNaN(val) && val <= 0) {
      throw new BadRequestException(`Validation failed. "${value}" is not a positive integer.`);
    }
    return val;
  }
}
