import { BadRequestException, Injectable } from '@nestjs/common';
import { pool } from 'src/main';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostgresqlService {
  constructor(private prisma: PrismaService) {}

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
    return res.rows.length != 0
      ? res.rows
      : { msg: 'No data found for the interval or branch id' };
  }

  async getCurrentReservation(uid: string, branchNo: string) {
    const client = await pool.connect();
    const formattedBranchNo = String(branchNo).padStart(2, '0');
    const branch_id = `${uid}_${formattedBranchNo}`;
    const query = `SELECT 
      reservation_info.reservation_id,customer_info.name, reservation_info.reservation, reservation_info.status 
    FROM 
      reservation_info LEFT JOIN customer_info ON reservation_info.customer_uid=customer_info.customer_uid
    WHERE 
      reservation_info.branch_id= $1::text;`;
    const res = await client.query(query, [branch_id]);
    client.release();
    return res.rows.length == 0
      ? { msg: 'No Reservation made with this branch' }
      : res.rows;
  }

  async getCustomerByStatus(uid: string, branchNo: string, status: string[]) {
    const client = await pool.connect();
    const formattedBranchNo = String(branchNo).padStart(2, '0');
    const branch_id = `${uid}_${formattedBranchNo}`;

    const res = await Promise.all(
      status.map(async (value, index) => {
        const query = `SELECT count(customer_uid) FROM reservation_info
      where branch_id=$1::text and status=$2::text`;
        const row = await client.query(query, [branch_id, value]);
        console.log(row.rows[0].count);
        return { [value]: row.rows[0].count };
      }),
    );
    client.release();
    return res;
  }

  async getRevenueInfo(
    uid: string,
    branchNo: string,
    start: string,
    end: string,
  ) {
    try {
      const client = await pool.connect();
      const formattedBranchNo = String(branchNo).padStart(2, '0');
      const branch_id = `${uid}_${formattedBranchNo}`;
      const dateStart = new Date(start);
      const dateEnd = new Date(end);
      const query = `
              WITH aggregated_expenses AS (
                SELECT 
                    DATE(date) AS date,
                    SUM(amount) AS total_expenses
                FROM 
                    expenses_summary
                WHERE 
                    branch_id = $1::text  
                GROUP BY 
                    DATE(date)
            ),
            aggregated_earnings AS (
                SELECT 
                    DATE(date) AS date,
                    SUM(total_amount) AS total_earnings
                FROM 
                    customer_transaction
                WHERE 
                    branch_id = $1::text 
                GROUP BY 
                    DATE(date)
            )
            SELECT 
                COALESCE(ag.date, ae.date) AS date,
                COALESCE(ag.total_expenses, 0) AS expenses,
                COALESCE(ae.total_earnings, 0) AS earnings
            FROM 
                aggregated_expenses ag
            FULL JOIN 
                aggregated_earnings ae
            ON 
                ag.date = ae.date
            WHERE
                COALESCE(ag.date, ae.date) > $2::Date AND COALESCE(ag.date, ae.date) <= $3::Date
            ORDER BY 
                date;
            `;
      const res = await client.query(query, [branch_id, dateStart, dateEnd]);

      client.release();
      console.log(res.rows.length);
      return res.rows.length == 0
        ? { msg: 'No Reservation made with this branch' }
        : res.rows;
    } catch (error) {
      throw new BadRequestException(
        'Use appropriate date type (YYYY-MM-DD) and format or check other parameters',
      );
    }
  }

  async getExpensesCategory(uid: string, branchNo: string) {
    const client = await pool.connect();
    const formattedBranchNo = String(branchNo).padStart(2, '0');
    const branch_id = `${uid}_${formattedBranchNo}`;

    const query = `
    SELECT 
      COUNT(expenses_summary.type) , expenses_summary.type 
    FROM 
      expenses_summary
    WHERE 
      expenses_summary.branch_id =$1::text
    GROUP BY 
      expenses_summary.type;
    `;
    const res = await client.query(query, [branch_id]);

    client.release();
    return res.rows.length == 0
      ? { msg: 'No expenses found for this branch' }
      : res.rows;
  }

  async getTopSpending(uid: string, branchNo: string) {}

  async getLatestReservations(uid: string, branchNo: string) {
    const client = await pool.connect();
    const formattedBranchNo = String(branchNo).padStart(2, '0');
    const branch_id = `${uid}_${formattedBranchNo}`;
    const query = `
    SELECT *
    FROM reservation_info
    WHERE (status = 'pending' OR status = 'confirmed') AND branch_id = $1::text
    ORDER BY (reservation->>'bookTime')::timestamp
    DESC`;
    const res = await client.query(query, [branch_id]);
    client.release();

    return res.rows.length == 0
    ? { msg: 'No reservations found for this branch' }
    : res.rows;
  }
}
