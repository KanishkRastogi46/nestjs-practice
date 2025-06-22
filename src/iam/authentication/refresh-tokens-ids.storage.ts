import { 
    HttpException,
    Injectable, 
    OnApplicationBootstrap, 
    OnApplicationShutdown 
} from "@nestjs/common";
import Redis from "ioredis";


export class InvalidRefreshTokenException extends HttpException {
    constructor() {
        super('Invalid refresh token', 401);
    }
}

@Injectable()
export class RefreshTokensIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
    private redisClient: Redis

    onApplicationBootstrap() {
        this.redisClient = new Redis({
            host: 'localhost',
            port: 6379,
        })
    }

    onApplicationShutdown(signal?: string) {
        return this.redisClient.quit()
    }

    async insert(userId: number, tokenId: string): Promise<void> {
        await this.redisClient.set(
            this.getKey(userId),
            tokenId,
        )
    }

    async validate(userId: number, tokenId: string): Promise<boolean> {
        const getTokenId = await this.redisClient.get(this.getKey(userId))
        if (getTokenId !== tokenId) {
            throw new InvalidRefreshTokenException()
        }
        return getTokenId === tokenId
    }

    async inValidate(userId: number): Promise<void> {
        await this.redisClient.del(this.getKey(userId))
    }

    getKey(userId: number): string {
        return `user-${userId}`
    }
}
