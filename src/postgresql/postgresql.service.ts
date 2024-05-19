import { Injectable } from '@nestjs/common';
import { pool } from 'src/main';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostgresqlService {
  constructor(private prisma : PrismaService){}

  async getBranchOutletInfo() {
    return this.prisma.branch_outlet.findMany();
  }

  async getExpensesSummary(uid: string, branchNo: string) {
    const client = await pool.connect();
    const formattedBranchNo = String(branchNo).padStart(2, '0'); //branch_id is uid_branchNo , where branchNo is expected to be two digit length, ranging from 00-99
    const branch_id = `${uid}_${formattedBranchNo}`;
    const query = 'SELECT * FROM expenses_summary WHERE branch_id = $1::text';
    const res = await client.query(query, [branch_id]);
    client.release();
    return res.rows;
  }

  async getCurrentCustomerStatus(uid: string, branchNo: string) {
    const client = await pool.connect();
    const formattedBranchNo = String(branchNo).padStart(2, '0');
    const branch_id = `${uid}_${formattedBranchNo}`;
    const query = `SELECT COUNT(transaction_id) FROM customer_transaction WHERE customer_transaction.branch_id ='${branch_id}';`;
    const res = await client.query(query, [branch_id]);
    client.release();
  }

  async getMontlyUser(
    uid: string,
    branchNo: string,
    startYearMonth: string,
    endYearMonth: string,
  ) {
    const client = await pool.connect();
    const formattedBranchNo = String(branchNo).padStart(2, '0');
    const branch_id = `${uid}_${formattedBranchNo}`;
    const query = `SELECT * FROM transaction_counts_by_branch_and_month 
    WHERE 
        branch_id = $1::text
        AND
        month_year >= TO_DATE($2, 'YYYY-MM')
        AND 
        month_year < TO_DATE($3, 'YYYY-MM') + INTERVAL '1 month';`;
    const res = await client.query(query, [
      branch_id,
      startYearMonth,
      endYearMonth,
    ]);

    client.release();
    return (res.rows.length !=0) ? res.rows : {msg : "No data found for the interval or branch id"}
  }
}
