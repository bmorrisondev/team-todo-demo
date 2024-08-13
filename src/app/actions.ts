'use server'
import { neon } from "@neondatabase/serverless";
import { canCreateTasks, getUserInfo } from "./security";
import { getDb } from "@/db/db";
import { tasks } from "@/db/schema";
import { and, eq, InferSelectModel } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}
const sql = neon(process.env.DATABASE_URL);

export type Task = InferSelectModel<typeof tasks>

export async function getTasks(): Promise<Task[]> {
  const { ownerId } = getUserInfo();
  const db = await getDb()
  return await db.select().from(tasks).where(eq(tasks.owner_id, ownerId))
}

export async function createTask(name: string) {
  if(!canCreateTasks()) {
    throw new Error("User not permitted to create tasks")
  }

  const db = await getDb()
  const { userId, ownerId } = getUserInfo();
  await db.insert(tasks).values({
    name: name,
    owner_id: ownerId,
    created_by_id: userId
  }).execute()
}

export async function setTaskState(taskId: number, isDone: boolean) {
  const { userId, ownerId } = getUserInfo();

  const db = await getDb()
  await db.update(tasks).set({
    is_done: isDone
  }).where(and(
    eq(tasks.id, taskId),
    eq(tasks.owner_id, ownerId)
  )).execute()
}

export async function updateTask(taskId: number, name: string, description: string) {
  const { ownerId } = getUserInfo();

  const db = await getDb()
  await db.update(tasks).set({
    name: name,
    description: description
  }).where(and(
    eq(tasks.id, taskId),
    eq(tasks.owner_id, ownerId)
  )).execute()
}

export async function getLicenseCount(clerkOrgId: string) {
  const db = await getDb()
  const row = await db.query.orgs.findFirst({
    where: (orgs, { eq }) => eq(orgs.org_id, clerkOrgId)
  })
  return row?.license_count || 0
}

export async function getStripeCustomerIdFromOrgId(clerkOrgId: string) {
  const db = await getDb()
  const row = await db.query.orgs.findFirst({
    where: (orgs, { eq }) => eq(orgs.org_id, clerkOrgId)
  })
  if(!row) return null
  return row.stripe_customer_id
}