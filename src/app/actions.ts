'use server'
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}
const sql = neon(process.env.DATABASE_URL);

function getUserInfo() {
  const { sessionClaims } = auth();
  if (!sessionClaims) {
    throw new Error('No session claims');
  }
  return {
    userId: sessionClaims.sub,
  }
}

export async function getTasks() {
  const { userId } = getUserInfo();
  let res = await sql`
    select * from tasks
      where owner_id = ${userId};
  `;
  return res;
}

export async function createTask(name: string) {
  const { userId } = getUserInfo();
  await sql`
    insert into tasks (name, owner_id, created_by_id)
      values (${name}, ${userId}, ${userId});
  `;
}

export async function setTaskState(taskId: number, isDone: boolean) {
  const { userId } = getUserInfo();
  await sql`
    update tasks set is_done = ${isDone}
      where id = ${taskId} and owner_id = ${userId};
  `;
}

export async function updateTask(taskId: number, name: string, description: string) {
  const { userId } = getUserInfo();
  await sql`
    update tasks set name = ${name}, description = ${description}
      where id = ${taskId} and owner_id = ${userId};
  `;
}