import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { compare, hash } from 'bcrypt';

@Injectable()
export class BcryptService extends HashingService {
    async hash(password: string): Promise<String> {
        return await hash(password, 10);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return compare(password, hash);
    }
}
