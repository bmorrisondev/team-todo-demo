import { boolean, integer, json, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: text('name'),
  is_done: boolean('is_done'),
  owner_id: text('owner_id'),
  created_in: timestamp('created_on'),
  created_by_id: text('created_by_id'),
  description: text('description')
});

export const orgs = pgTable('orgs', {
  org_id: text('org_id').notNull(),
  stripe_customer_id: text('stripe_customer_id').notNull(),
  license_count: integer('license_count').default(0).notNull()
})