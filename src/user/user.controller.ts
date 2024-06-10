import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CustomerDto } from 'src/user/dto/customer.dto';
import { OwnerDto } from 'src/user/dto/owner.dto';
import { ApiBody } from '@nestjs/swagger';
import { response } from 'express';
import { BranchInfoBusiness } from 'src/DTO/branchInfo-business.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('ownerData/:email')
  async getOwner(@Param('email') email: string): Promise<OwnerDto | Object> {
    let data = await this.userService.getOwner(email);
    return data;
  }

  @Get('customerData/:email')
  async getCustomer(
    @Param('email') email: string,
  ): Promise<CustomerDto | Object> {
    let data = await this.userService.getOwner(email);
    return data;
  }

  @Post('createOwner/:uid')
  @ApiBody({ type: [OwnerDto] })
  async createOwner(@Body() body: OwnerDto, @Param('uid') uid: string) {
    const result = await this.userService.createOwner(body, uid);
    return result;
  }

  @Post('updateBusinessInfo/:uid')
  async updatebusinessInfo(
    @Body() body: BranchInfoBusiness,
    @Param('uid') uid: string,
  ): Promise<Object> {
    if (body.businessName != null && body.branchInfo != null) {
      try {
        await this.userService.updateBusinessInfo(body, uid);
        return { success: true };
      } catch (error) {
        return { error: 'Error updating to FireStore' };
      }
    } else {
      return response.status(402).json({ error: 'Specify all fields' });
    }
  }

  //This POST request must be invoked upon success firebase auth registration
  // Purpose is to update Firestore Record and PostgreSQL Record

  @Post('updateProfileUrl/:uid')
  async updateProfileUrl(@Param('uid') uid: string): Promise<Object> {
    if (uid) {
      const response = this.userService.updateImage(uid);
      return response;
    } else {
      response.status(400).send('Bad Request');
      return { error: 'Must specify UID' };
    }
  }
}
