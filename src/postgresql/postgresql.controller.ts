import { Controller, Get, Param, Req } from '@nestjs/common';
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
}
