'use server'
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";
import { and, eq } from "drizzle-orm";

let _db: NodePgDatabase<typeof schema>;

export async function getDb(): Promise<NodePgDatabase<typeof schema>>{
  if(!_db) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    _db = drizzle(pool);
  }
  return _db;
}