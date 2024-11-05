import { db } from '../db';
import { shippingRates } from '../schema';
import { and, eq, sql } from 'drizzle-orm';

export async function getShippingRates(startCity: string, endCity: string) {
    const [rate] = await db
        .select()
        .from(shippingRates)
        .where(
            and(
                eq(shippingRates.startCity, startCity),
                eq(shippingRates.endCity, endCity)
            )
        )
        .limit(1);

    if (!rate) {
        throw new Error('No shipping rates found for this route');
    }

    return {
        price_per_kg_composition: rate.pricePerKgComposition,
        price_per_kg_door: rate.pricePerKgDoor,
        estimated_delivery_days_min: rate.estimatedDeliveryDaysMin,
        estimated_delivery_days_max: rate.estimatedDeliveryDaysMax,
        base_cost_composition: rate.baseCostComposition,
        base_cost_door: rate.baseCostDoor,
    };
}

export async function getBaseCosts() {
    return {
        composition: 1000,
        door: 1500,
    };
}

export async function getCitiesList() {
    const result = await db.execute(sql`
        SELECT DISTINCT city FROM (
            SELECT start_city as city FROM shipping_rates
            UNION
            SELECT end_city as city FROM shipping_rates
        ) as cities
        ORDER BY city
    `);
    return result.rows.map(row => row.city);
} 