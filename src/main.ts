import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import "reflect-metadata";
import * as admin from 'firebase-admin';
import pg from 'pg'
const { Pool, Client } = pg
import { NextFunction, Request, Response } from 'express';

import { error } from 'console';


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
  }else{
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
    origin:true, //Same as any source
    credentials:true,
 });

 //Enable firebase JWT token authorization
  // app.use(decodeIDToken);
  
  await app.listen(8080);
}

//Connection to Postgres sample
const client = new Client({
	user: 'admin',
	password: 'admin123',
	host: 'pixelmindgame.ddns.net',
	port: '5432',
	database: 'trimly',
});
async function postgresConn(){
  await client.connect().then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });
} 

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
postgresConn();
// fireStoreQuery();
// postgresConn();

export {admin, client}

