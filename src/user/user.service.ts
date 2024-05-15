import { Injectable } from '@nestjs/common';
import {admin} from '../main';
import { OwnerDto } from 'src/DTO/user/owner.dto';
import { CustomerDto } from 'src/DTO/user/customer.dto';
import { BranchInfoBusiness } from 'src/DTO/branchInfo-business.dto';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
@Injectable()
export class UserService {
    async  getOwner(email: string) : Promise<OwnerDto | Object>{
       
        const db = admin.firestore();
       // Get a reference to the 'UserModule' collection
        const collectionRef = db.collection('UserModule');

        // Query for documents where the 'username' field equals a specific value
        const querySnapshot = await collectionRef.where('email', '==', email).get();
        
        // Check if any documents match the query
        if (!querySnapshot.empty) {
            // If there are matching documents, access the first one (assuming username is unique)
            const documentSnapshot = querySnapshot.docs[0];
            
            // Access the data of the document
            const userData = new OwnerDto(documentSnapshot.data());
            console.log(userData.profileImgUrl);
            return {data : userData};
        }else{
            return {error : 'User Not Found'};
        }
    }
    async  getCustomer(email: string) : Promise<CustomerDto | Object>{
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
        }else{
            return {msg : 'User Not Found'};
        }
    }

    async createOwner(ownerDto : OwnerDto, uid : string ) : Promise<Object>{
        const db = admin.firestore();
       // Get a reference to the 'UserModule' collection
        const collectionRef = db.collection('UserModule');
        let response : Object = {};
        console.log(ownerDto);
        await collectionRef.doc(uid).set(JSON.parse(JSON.stringify(ownerDto))).then(()=>{
            response = {success : 'Owner created successfully'}
        })
        .catch(error =>{
            response  = {error : "Failed to create owner. Error :" + error}
        })
        return response;
    }

    async updateBusinessInfo(body: BranchInfoBusiness, uid:string) : Promise<Object>{
        const db = admin.firestore();
       // Get a reference to the 'UserModule' collection
        const collectionRef = db.collection('UserModule');
        let response : Object = {}
        await collectionRef.doc(uid).update({branchInfo : body.branchInfo, businessName: body.businessName }).then(()=>{
            response = {success : 'Business info updated'}
        })
        .catch(error =>{
            response  = {error : "Failed to update business info. Error :" + error}
        })
        return response;
    }

    async updateImage(uid: string): Promise<Object> {
        const fileRef = getStorage().bucket('trimly-web.appspot.com').file(`profile/${uid}`);
        const downloadUrl = await getDownloadURL(fileRef);
        console.log(downloadUrl);
        const db = admin.firestore();
        const collectionRef = db.collection('UserModule');
        let response : Object = {}
        await collectionRef.doc(uid).update({profileImgUrl : downloadUrl}).then(()=>{
            response = {success : 'Profile image updated in bucket and Firebase', profileImgUrl: downloadUrl}
        })
        .catch(error =>{
            response  = {error : "Failed to update profile picture. UID does not exist. Error :" + error}
        })

        return response;
    }
}
