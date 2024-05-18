import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as admin from 'firebase-admin';
import pg from 'pg';
const { Pool, Client } = pg;
import { NextFunction, Request, Response } from 'express';

import { error } from 'console';
import { ValidationPipe } from '@nestjs/common';

const serviceAccount = require('../trimly-web-firebase-adminsdk-ftol6-2c04bf6513.json');

//JWT Token (Web client currently using user Firebase ID Token)
async function decodeIDToken(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split(' ')[1];
    try {
      await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

//App engine and configuration (middleware should be appended in here)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Trimly API')
    .setDescription('API for Trimly Web & Mobile App')
    .setVersion('1.0')
    .addTag('development')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Setup CORS options for server (since token based authorization required)
  app.enableCors({
    origin: true, //Same as any source
    credentials: true,
  });

  //Enable firebase JWT token authorization
  // app.use(decodeIDToken);

  //enable validation for body and etc. globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // whitelist truncate/removes fields that are not validated with decorator of the DTO

  await app.listen(8080);
}

//Connection to Postgres sample
// const client = new Client({
//   user: 'trimlydev',
//   password: 'developer#Nest',
//   host: 'trimlypostgres.postgres.database.azure.com',
//   port: '5432',
//   database: 'trimly',
//   ssl: true,
// });
const pool = new Pool({
  user: 'trimlydev',
  password: 'developer#Nest',
  host: 'trimlypostgres.postgres.database.azure.com',
  port: '5432',
  database: 'trimly',
  ssl: true,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize admin SDK for firebase service access
//For Development
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'trimly-web.appspot.com',
//   projectId: 'trimly-web',
// });
//For production
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: 'trimly-web.appspot.com',
  projectId: 'trimly-web',
});

bootstrap();
// fireStoreQuery();
// postgresConn();

export { admin, pool };
