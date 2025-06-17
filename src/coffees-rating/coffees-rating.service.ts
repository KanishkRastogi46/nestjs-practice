import { Inject, Injectable } from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';

@Injectable()
export class CoffeesRatingService {
    constructor(
        private readonly coffeeService: CoffeesService,
    ) {}
}
