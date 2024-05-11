import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomerDto } from 'src/DTO/user/customer.dto';
import { OwnerDto } from 'src/DTO/user/owner.dto';
import { ApiBody } from '@nestjs/swagger';
import { validate } from 'class-validator';
import { response } from 'express';
@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService){}

    @Get('ownerData/:email')
    async getOwner(@Param('email') email : string): Promise<OwnerDto | Object>{
      let data = await this.userService.getOwner(email) as OwnerDto | Object
      return data;
    }

    @Get('customerData/:email')
    async getCustomer(@Param('email') email : string): Promise<CustomerDto | Object>{
      let data = await this.userService.getOwner(email)
      return data;
    }
    
    @Post('createOwner/:uid')
    @ApiBody({type: [OwnerDto]})
    async createOwner(@Body() body: any , @Param('uid') uid : string ) : Promise<Object>{
      const ownerDto = new OwnerDto(body)

      const check = await validate(ownerDto);
      console.log(check)

      if(check.values.length == 0){
      try {
          await this.userService.createOwner(ownerDto, uid);
          return { success: true };
      } catch (error) {
        return { error: 'Error updating to FireStore'};
      }
      }else{
        return { error: 'Error creating owner , wrong attributes in ',
        validateError : check.values
      };
      }

    }

    @Post('updateBusinessInfo/:uid')
    async updatebusinessInfo(@Body() body: any , @Param('uid') uid : string ) : Promise<Object>{
      if(body.businessName != null && body.branchInfo != null){
        try {
          await this.userService.updateBusinessInfo(body, uid)
          return { success: true };
      } catch (error) {
        return { error: 'Error updating to FireStore'};
      }
      }
      else{
        return response.status(402).json({error:'Specify all fields'})
      }
     
      
      

    }
}
