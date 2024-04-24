import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as admin from 'firebase-admin';

import { Client } from 'pg';

const serviceAccount = require('../../trimly-web-firebase-adminsdk-ftol6-2c04bf6513.json');

// Initialize admin SDK for firebase service access

//For Development
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), 
  projectId: 'trimly-web',
});

//For production
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(), 
//   projectId: 'trimly-web',
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

//Sample querying
async function fireStoreQuery() {
  const db = admin.firestore();
  const snapshot = await db.collection('UserModule').doc('kC6tGN6HcRTB0moJpPrM').get();
  
  console.log(snapshot);
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

bootstrap();
fireStoreQuery();
postgresConn();


