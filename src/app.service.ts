import { Injectable } from '@nestjs/common';
import { BranchInfo } from './DTO/branchInfo.dto';
import { BranchInfoBusiness } from './DTO/branchInfo-business.dto';
import { admin, client} from './main';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getGoodBye():string{
    return 'Goodbye!'
  }
  async getBranchInfo(uid : string): Promise<BranchInfoBusiness | Object> {
    const db = admin.firestore();
    const collectionRef = db.collection('UserModule');
    const docRef =  collectionRef.doc(uid);
    try {
      const docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
          const data = docSnapshot.data();
          if (data) {
              const branchInfo = data.branchInfo as Array<BranchInfo>; // Replace "fieldName" with the name of the field you want to retrieve
              const businessName = data.businessName;
              const branchInfoBusiness = new BranchInfoBusiness({branchInfo : branchInfo, businessName: businessName})
              return branchInfoBusiness ;
          } else {
              console.log('Document does not contain any data');
              return { error : "Document dose not contain the data"}
          }
      } else {
          console.log('Document does not exist');
          return { error : "Document dose not exist"}
      }
  } catch (error) {
      console.error('Error getting document:', error);
      return { error : "Error fetching document"}
  }
  }

  
}
