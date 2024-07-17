'use server'
import { neon } from "@neondatabase/serverless";
import { getUserInfo } from "./security";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}
const sql = neon(process.env.DATABASE_URL);

export type Task = {
  id: number;
  name: string;
  description: string;
  is_done: boolean;
  owner_id: number;
  created_on: Date;
}

export async function getTasks(): Promise<Task[]> {
  const { ownerId } = getUserInfo();
  let res = await sql`
    select * from tasks
      where owner_id = ${ownerId};
  `;
  return res as Task[];
}

export async function createTask(name: string) {
  const { userId, ownerId } = getUserInfo();
  await sql`
    insert into tasks (name, owner_id, created_by_id) values (${name}, ${ownerId}, ${userId});
  `;
}

export async function setTaskState(taskId: number, isDone: boolean) {
  const { userId, ownerId } = getUserInfo();
  await sql`
    update tasks set is_done = ${isDone} where id = ${taskId} and owner_id = ${ownerId};
  `;
}

export async function updateTask(taskId: number, name: string, description: string) {
  const { userId, ownerId } = getUserInfo();
  await sql`
    update tasks set name = ${name}, description = ${description}, updated_by_id = ${userId}, updated_on = now()
      where id = ${taskId} and owner_id = ${ownerId};
  `;
}

export async function getLicenseCount(clerkOrgId: string) {
  const [row] = await sql`select license_count from orgs where org_id=${clerkOrgId}`
  return row?.license_count || 0
}

export async function getStripeCustomerIdFromOrgId(clerkOrgId: string) {
  const [row] = await sql`select stripe_customer_id from orgs where org_id=${clerkOrgId}`
  return row.stripe_customer_id
}