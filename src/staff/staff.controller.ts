import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffDto } from 'src/DTO/model/staff/staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('listStaffs/:uid/:branch_id')
  async getStaffList(
    @Param('uid') uid: string,
    @Param('branch_id') branch_id: string,
  ) {
    try {
      const result = await this.staffService.getAllStaff(uid, branch_id);
      return result;
    } catch (error) {
      return error;
    }
  }

  @Post('add/:uid/:branch_id')
  async addStaff(
    @Param('uid') uid: string,
    @Param('branch_id') branch_id: string,
    @Body() staffDto: StaffDto,
  ) {
    
    return this.staffService.addStaff(uid, branch_id, staffDto);
  }
}
