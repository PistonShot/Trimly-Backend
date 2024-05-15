import { Injectable } from '@nestjs/common';
import { client } from 'src/main';

@Injectable()
export class PostgresqlService {

    async getBranchOutletInfo() {
        const query = "SELECT * FROM branch_outlet";
        const res = await client.query(query);
        return res.rows
      }

    async getExpensesSummary(uid : string, branchNo : string) {
      const formattedBranchNo = String(branchNo).padStart(2, '0'); //branch_id is uid_branchNo , where branchNo is expected to be two digit length, ranging from 00-99
      const branch_id = `${uid}_${formattedBranchNo}`;
      const query = "SELECT * FROM expenses_summary WHERE branch_id = $1::text";
      const res = await client.query(query, [branch_id]);
      console.log(formattedBranchNo);
      return res.rows[0];
      
    }
    
}
