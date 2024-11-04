'use client';

import { useState, useEffect } from 'react';
import { db } from '../db';
import { shippingRates } from '../schema';
import { sql } from 'drizzle-orm';
import type { ShippingRates } from '../schema';

interface ShippingData {
    rates: ShippingRates | null;
    startCities: string[];
    endCities: string[];
}

export function useShippingData(startCity: string, endCity: string): [ShippingData, string | null] {
    const [data, setData] = useState<ShippingData>({
        rates: null,
        startCities: [],
        endCities: []
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch rates for selected cities
                if (startCity && endCity) {
                    const [rate] = await db
                        .select()
                        .from(shippingRates)
                        .where(sql`${shippingRates.startCity} = ${startCity} AND ${shippingRates.endCity} = ${endCity}`);

                    if (rate) {
                        setData(prev => ({
                            ...prev,
                            rates: {
                                price_per_kg_composition: Number(rate.pricePerKgComposition),
                                price_per_kg_door: Number(rate.pricePerKgDoor),
                                estimated_delivery_days_min: rate.estimatedDeliveryDaysMin,
                                estimated_delivery_days_max: rate.estimatedDeliveryDaysMax,
                                base_cost_composition: Number(rate.baseCostComposition),
                                base_cost_door: Number(rate.baseCostDoor)
                            }
                        }));
                    }
                }

                // Fetch all cities
                const allRates = await db.select().from(shippingRates);
                const startCities = [...new Set(allRates.map(r => r.startCity))];
                const endCities = [...new Set(allRates.map(r => r.endCity))];

                setData(prev => ({
                    ...prev,
                    startCities,
                    endCities
                }));

            } catch (err) {
                console.error('Error fetching shipping data:', err);
                setError('Failed to load shipping data');
            }
        };

        fetchData();
    }, [startCity, endCity]);

    return [data, error];
} 