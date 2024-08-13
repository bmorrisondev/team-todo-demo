import type { Config } from "drizzle-kit";
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
} satisfies Config;
