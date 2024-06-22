import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { StaffDto } from 'src/DTO/model/staff/staff.dto';
import { admin } from 'src/main';

@Injectable()
export class StaffService {
  async getAllStaff(uid: string, branch_id: string): Promise<Object> {
    const db = admin.firestore();
    const collectionRef = db
      .collection('UserModule')
      .doc(uid)
      .collection('branch')
      .doc(branch_id)
      .collection('staff');

    try {
      const snapshot = await collectionRef.get();
      if (!snapshot.empty) {
        const result = snapshot.docs.map((doc) => doc.data());
        return result;
      } else {
        return new BadRequestException(
          'Collection does not exist for UID or branchId',
        );
      }
    } catch (error) {
      console.error('Error retrieving documents:', error);
      throw new ForbiddenException(
        'Collection does not exist for UID or branchId',
      );
    }
  }

  async addStaff(
    uid: string,
    branch_id: string,
    staffDto: StaffDto,
  ): Promise<Object> {
    const db = admin.firestore();
    const collectionRef = db
      .collection('UserModule')
      .doc(uid)
      .collection('branch')
      .doc(branch_id)
      .collection('staff');
    const newStaffRef = collectionRef.doc();
    await newStaffRef.set(staffDto);
    return { id: newStaffRef.id , staffDto: staffDto};
  }
}
