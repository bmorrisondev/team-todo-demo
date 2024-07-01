'use server'
import { auth } from "@clerk/nextjs/server";
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
  const { userId } = getUserInfo();
  let res = await sql`
    select * from tasks
      where owner_id = ${userId};
  `;
  return res as Task[];
}

export async function createTask(name: string) {
  const { userId } = getUserInfo();
  await sql`
    insert into tasks (name, owner_id, created_by_id) values (${name}, ${userId}, ${userId});
  `;
}

export async function setTaskState(taskId: number, isDone: boolean) {
  const { userId } = getUserInfo();
  await sql`
    update tasks set is_done = ${isDone}, updated_by_id = ${userId}, updated_on = now()
      where id = ${taskId} and owner_id = ${userId};
  `;
}

export async function updateTask(taskId: number, name: string, description: string) {
  const { userId } = getUserInfo();
  await sql`
    update tasks set name = ${name}, description = ${description}, updated_by_id = ${userId}, updated_on = now()
      where id = ${taskId} and owner_id = ${userId};
  `;
}