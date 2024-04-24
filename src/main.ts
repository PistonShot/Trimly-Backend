import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as admin from 'firebase-admin';
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
bootstrap();
fireStoreQuery();

