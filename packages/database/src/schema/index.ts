import { pgTable, text, timestamp, varchar, numeric, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// User table schema
export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }),
  user_type: varchar('user_type', { length: 50 }).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Auth session table
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// Define the shipping rates interface
export interface ShippingRates {
    id: string;
    startCity: string;
    endCity: string;
    pricePerKgComposition: number;
    pricePerKgDoor: number;
    estimatedDeliveryDaysMin: number;
    estimatedDeliveryDaysMax: number;
    baseCostComposition: number;
    baseCostDoor: number;
    createdAt: Date;
    updatedAt: Date;
}

// Define the shipping data interface
export interface ShippingData {
    rates: ShippingRates | null;
    cities: {
        start: string[];
        end: string[];
    };
}

// Database table schema
export const shippingRates = pgTable('shipping_rates', {
    id: text('id').primaryKey().notNull(),
    startCity: varchar('start_city', { length: 100 }).notNull(),
    endCity: varchar('end_city', { length: 100 }).notNull(),
    pricePerKgComposition: numeric('price_per_kg_composition').notNull(),
    pricePerKgDoor: numeric('price_per_kg_door').notNull(),
    estimatedDeliveryDaysMin: integer('estimated_delivery_days_min').notNull(),
    estimatedDeliveryDaysMax: integer('estimated_delivery_days_max').notNull(),
    baseCostComposition: numeric('base_cost_composition').notNull(),
    baseCostDoor: numeric('base_cost_door').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  user_type: z.enum(['user', 'worker']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const insertShippingRateSchema = createInsertSchema(shippingRates);
export const selectShippingRateSchema = createSelectSchema(shippingRates);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type LoginSchema = z.infer<typeof loginSchema>;
export type ShippingRate = z.infer<typeof selectShippingRateSchema>; 