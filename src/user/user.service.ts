import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { admin } from '../main';
import { OwnerDto } from 'src/user/dto/owner.dto';
import { CustomerDto } from 'src/user/dto/customer.dto';
import { BranchInfoBusiness } from 'src/DTO/branchInfo-business.dto';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { error } from 'console';
@Injectable()
export class UserService {
  async getOwner(email: string): Promise<OwnerDto | Object> {
    const db = admin.firestore();
    const collectionRef = db.collection('UserModule');
    const querySnapshot = await collectionRef.where('email', '==', email).get();
    if (!querySnapshot.empty) {
      const documentSnapshot = querySnapshot.docs[0];
      const userData = documentSnapshot.data();
      console.log(userData.profileImgUrl);
      return userData;
    } else {
      throw new ForbiddenException('User not found');
    }
  }
  async getCustomer(email: string): Promise<CustomerDto | Object> {
    const db = admin.firestore();
    // Get a reference to the 'UserModule' collection
    const collectionRef = db.collection('Customer');

    // Query for documents where the 'username' field equals a specific value
    const querySnapshot = await collectionRef.where('email', '==', email).get();

    // Check if any documents match the query
    if (!querySnapshot.empty) {
      // If there are matching documents, access the first one (assuming username is unique)
      const documentSnapshot = querySnapshot.docs[0];

      // Access the data of the document
      const userData = documentSnapshot.data() as OwnerDto;
      return userData;
    } else {
      throw new ForbiddenException('User not found');
    }
  }

  async createOwner(ownerDto: OwnerDto, uid: string) {
    const auth = admin.auth();
    const createOwner = await auth
      .getUser(uid)
      .then(async (userRecord) => {
        const db = admin.firestore();
        // Get a reference to the 'UserModule' collection
        const collectionRef = db.collection('UserModule');
        console.log(ownerDto);
        await collectionRef
          .doc(uid)
          .set(JSON.parse(JSON.stringify(ownerDto)))
          .then(() => {
            return { success: 'Owner created successfully' };
          })
          .catch((error) => {
            throw new ServiceUnavailableException(
              'Failed to update user in Firestore',
            );
          });
      })
      .catch((error) => {
        throw new ForbiddenException('User ID not found');
      });

    return createOwner;
  }

  async updateBusinessInfo(
    body: BranchInfoBusiness,
    uid: string,
  ): Promise<Object> {
    const db = admin.firestore();
    // Get a reference to the 'UserModule' collection
    const collectionRef = db.collection('UserModule');
    let response: Object = {};
    await collectionRef
      .doc(uid)
      .update({ branchInfo: body.branchInfo, businessName: body.businessName })
      .then(() => {
        response = { success: 'Business info updated' };
      })
      .catch((error) => {
        response = { error: 'Failed to update business info. Error :' + error };
      });
    return response;
  }

  async updateImage(uid: string) {
    const auth = admin.auth();
    let response = auth
      .getUser(uid)
      .then(async (user) => {
        const fileRef = getStorage()
          .bucket('trimly-web.appspot.com')
          .file(`profile/${uid}`);
        const downloadUrl = await getDownloadURL(fileRef);
        const db = admin.firestore();
        const collectionRef = db.collection('UserModule');
        return await collectionRef
          .doc(uid)
          .update({ profileImgUrl: downloadUrl })
          .then(() => {
            return {
              success: 'Profile image updated in Bucket and Firestore',
              profileImgUrl: downloadUrl,
            };
          });
      })
      .catch((error) => {
        throw new ForbiddenException('Invalid UID');
      });

    return response;
  }
}
