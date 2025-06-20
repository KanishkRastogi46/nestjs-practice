import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
    abstract hash(password: string): Promise<String>
    abstract compare(password: string, hash: string): Promise<boolean>
}
