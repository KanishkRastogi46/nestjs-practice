import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { WrapResponseInterceptor } from './interceptors/wrap-response.interceptor';

@Module({
    imports: [
        ConfigModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: WrapResponseInterceptor
        }
    ]
})
export class CommonModule {}
