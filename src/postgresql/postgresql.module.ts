import { Module } from '@nestjs/common';
import { PostgresqlController } from './postgresql.controller';
import { PostgresqlService } from './postgresql.service';

@Module({
    controllers: [PostgresqlController],
    providers : [PostgresqlService]
})
export class PostgresqlModule {}
