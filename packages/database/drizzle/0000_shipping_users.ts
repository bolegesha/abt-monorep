import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  fullName: varchar('full_name', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  userType: varchar('user_type', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shippingRates = pgTable('shipping_rates', {
  id: text('id').primaryKey().notNull(),
  startCity: varchar('start_city', { length: 100 }).notNull(),
  endCity: varchar('end_city', { length: 100 }).notNull(),
  pricePerKgComposition: varchar('price_per_kg_composition', { length: 10 }).notNull(),
  pricePerKgDoor: varchar('price_per_kg_door', { length: 10 }).notNull(),
  estimatedDeliveryDaysMin: varchar('estimated_delivery_days_min', { length: 5 }).notNull(),
  estimatedDeliveryDaysMax: varchar('estimated_delivery_days_max', { length: 5 }).notNull(),
  baseCostComposition: varchar('base_cost_composition', { length: 10 }).notNull(),
  baseCostDoor: varchar('base_cost_door', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 