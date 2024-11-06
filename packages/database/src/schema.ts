import { pgTable, varchar, decimal, integer, timestamp } from 'drizzle-orm/pg-core';

// User and auth schemas
export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  fullName: varchar('full_name').notNull(),
  user_type: varchar('user_type', { enum: ['user', 'worker', 'admin'] }).notNull(),
});

export const sessions = pgTable('sessions', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id')
    .notNull()
    .references(() => users.id),
  token: varchar('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
});

// Shipping schemas
export const shippingRoutes = pgTable('shipping_routes', {
  startCity: varchar('start_city').notNull(),
  endCity: varchar('end_city').notNull(),
  pricePerKgComposition: decimal('price_per_kg_composition').notNull(),
  pricePerKgDoor: decimal('price_per_kg_door').notNull(),
  estimatedDeliveryDaysMin: integer('estimated_delivery_days_min').notNull(),
  estimatedDeliveryDaysMax: integer('estimated_delivery_days_max').notNull(),
});

export const baseCosts = pgTable('base_costs', {
  baseCostComposition: decimal('base_cost_composition').notNull(),
  baseCostDoor: decimal('base_cost_door').notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type LoginSchema = { email: string; password: string };
export type ShippingRoute = typeof shippingRoutes.$inferSelect;
export type BaseCost = typeof baseCosts.$inferSelect; 