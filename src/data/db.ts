import { Deployment } from "@/types/DBTypes";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function getDeployments(page: number) {
  const result = await pool.query<Deployment>(
    "SELECT * FROM deployments ORDER BY created_at DESC LIMIT 20 OFFSET $1",
    [(page - 1) * 20]
  );

  return result.rows;
}

export async function getDeployment(actionId: string) {
  const result = await pool.query<Deployment>(
    "SELECT * FROM deployments WHERE action_id = $1",
    [actionId]
  );

  return result.rows[0];
}

export async function getDeploymentsRowCount(): Promise<number> {
  // This is apparently pretty inefficient in postgres, but I'm not sure
  // this table will ever get big enough for it to matter.
  const result = await pool.query("SELECT COUNT(*) FROM deployments");
  return result.rows[0].count;
}
