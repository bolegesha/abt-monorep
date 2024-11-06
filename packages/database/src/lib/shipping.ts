import { db } from '../db';
import { shippingRoutes, baseCosts } from '../schema';
import { and, eq } from 'drizzle-orm';

export interface ShippingRates {
  price_per_kg_composition: number;
  price_per_kg_door: number;
  estimated_delivery_days_min: number;
  estimated_delivery_days_max: number;
  base_cost_composition: number;
  base_cost_door: number;
}

export async function getShippingRates(startCity: string, endCity: string): Promise<ShippingRates> {
  const [route] = await db
    .select()
    .from(shippingRoutes)
    .where(and(
      eq(shippingRoutes.startCity, startCity),
      eq(shippingRoutes.endCity, endCity)
    ));

  if (!route) {
    throw new Error('No shipping rates found for this route');
  }

  const [costs] = await db.select().from(baseCosts);

  if (!costs) {
    throw new Error('Base costs not found');
  }

  return {
    price_per_kg_composition: Number(route.pricePerKgComposition),
    price_per_kg_door: Number(route.pricePerKgDoor),
    estimated_delivery_days_min: route.estimatedDeliveryDaysMin,
    estimated_delivery_days_max: route.estimatedDeliveryDaysMax,
    base_cost_composition: Number(costs.baseCostComposition),
    base_cost_door: Number(costs.baseCostDoor),
  };
}

export async function getCitiesList(): Promise<string[]> {
  const citiesResult = await db
    .select({ city: shippingRoutes.startCity })
    .from(shippingRoutes)
    .union(
      db.select({ city: shippingRoutes.endCity }).from(shippingRoutes)
    );

  return Array.from(new Set(citiesResult.map(result => result.city)));
}

export async function getBaseCosts() {
  const [costs] = await db.select().from(baseCosts);
  
  if (!costs) {
    throw new Error('Base costs not found');
  }

  return {
    composition: Number(costs.baseCostComposition),
    door: Number(costs.baseCostDoor),
  };
} 