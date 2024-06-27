'use server'
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

// Initialize the neon client with the DATABASE_URL
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
};

function getOwnerId(): string {
  const { sessionClaims } = auth();
  if (!sessionClaims) {
    throw new Error('No session claims');
  }
  return sessionClaims.org_id ? sessionClaims.org_id : sessionClaims.sub;
}

export async function getTasks(): Promise<Task[]> {
  const ownerId = getOwnerId();
  let res = await sql`select * from tasks where owner_id = ${ownerId};`;
  return res as Task[];
}

export async function createTask(name: string) {
  const ownerId = getOwnerId();
  await sql`insert into tasks (name, owner_id) values (${name}, ${ownerId});`;
}

export async function setTaskState(taskId: number, isDone: boolean) {
  const ownerId = getOwnerId();
  let res = await sql`update tasks set is_done = ${isDone} where id = ${taskId} and owner_id = ${ownerId};`;
  console.log(res)
}

export async function updateTask(taskId: number, name: string, description: string) {
  const ownerId = getOwnerId();
  let res = await sql`update tasks set name = ${name}, description = ${description} where id = ${taskId} and owner_id = ${ownerId};`;
  console.log(res)
}