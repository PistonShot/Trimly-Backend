import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://trimlydev:developer%23Nest@trimlypostgres.postgres.database.azure.com:5432/trimly?schema=public',
        },
      },
    });
  }
}

// Trimly Azure PostgreSql
// host : trimlypostgres.postgres.database.azure.com
// admin username : trimlydev
// password : developer#Nest (user %23 for #)