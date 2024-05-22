import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { PostgresqlService } from './postgresql.service';
import { Request } from 'express';
@Controller('postgresql')
export class PostgresqlController {
  constructor(private readonly postgresqlService: PostgresqlService) {}

  @Get('branchOutletInfo')
  async getBranchOutletInfo() {
    const data = await this.postgresqlService.getBranchOutletInfo();
    return data;
  }

  @Get('expensesSummary/:uid')
  async getExpensesSumary(@Param('uid') uid: string, @Req() request: Request) {
    const data = await this.postgresqlService.getExpensesSummary(
      uid,
      request.query.branchNo.toString(),
    );
    return data;
  }

  @Get('monthlyUsers/:uid/:branchNo/:startYearMonth/:endYearMonth')
  async getMonthlyUsers(
    @Param('uid') uid: string,
    @Param('branchNo') branchNo: string,
    @Param('startYearMonth') startYearMonth: string,
    @Param('endYearMonth') endYearMonth: string,
  ) {
    const data = await this.postgresqlService.getMontlyUser(
      uid,
      branchNo,
      startYearMonth,
      endYearMonth,
    );
    return data;
  }

  @Get('currentReservation/:uid/:branchNo')
  async getCurrentReservation(
    @Param('uid') uid: string,
    @Param('branchNo') branchNo: string,
  ) {
    const data = this.postgresqlService.getCurrentReservation(uid, branchNo);
    return data;
  }

  @Get('customerByStatus/:uid/:branchNo')
  async getCustomerByStatus(
    @Param('uid') uid: string,
    @Param('branchNo') branchNo: string,
    @Query('status') status: string,
  ) {
    try {
      const array = JSON.parse(decodeURIComponent(status));
      console.log(array);
      const data = this.postgresqlService.getCustomerByStatus(
        uid,
        branchNo,
        array,
      );
      return data;
    } catch (error) {
      throw new BadRequestException(
        'Send status as query param and as an array of string and makesure it is encoded with encodedUriComponent',
      );
    }
  }

  @Get('revenueInfo/:uid/:branchNo/:start/:end')
  async getRevenueInfo(
    @Param('uid') uid: string,
    @Param('branchNo') branchNo: string,
    @Param('start') start: string,
    @Param('end') end: string,
  ) {
    try {
      console.log(start)
      return this.postgresqlService.getRevenueInfo(uid, branchNo, start, end);
    } catch (error) {
      throw error;
    }
  }
}
