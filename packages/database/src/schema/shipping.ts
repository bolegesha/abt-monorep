import { pgTable, varchar, decimal, integer } from 'drizzle-orm/pg-core';

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

export interface ShippingRates {
  price_per_kg_composition: number;
  price_per_kg_door: number;
  estimated_delivery_days_min: number;
  estimated_delivery_days_max: number;
  base_cost_composition: number;
  base_cost_door: number;
} 