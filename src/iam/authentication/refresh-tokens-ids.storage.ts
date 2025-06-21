import { 
    Injectable, 
    OnApplicationBootstrap, 
    OnApplicationShutdown 
} from "@nestjs/common";

@Injectable()
export class RefreshTokensIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
    onApplicationBootstrap() {
        
    }

    onApplicationShutdown(signal?: string) {
        
    }
}
