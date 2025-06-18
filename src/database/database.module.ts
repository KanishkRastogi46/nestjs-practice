import { Module, DynamicModule } from '@nestjs/common';
import { createConnection, DataSourceOptions } from 'typeorm';

@Module({})
export class DatabaseModule {
    static register(options: DataSourceOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'DATABASE_CONNECTION',
                    useValue: createConnection(options)
                }
            ]
        }
    }
}
