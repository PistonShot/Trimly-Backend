import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
import { PostgresqlModule } from './postgresql/postgresql.module';
import { PrismaModule } from './prisma/prisma.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [UserModule, PostgresqlModule, PrismaModule, StaffModule],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule {}
