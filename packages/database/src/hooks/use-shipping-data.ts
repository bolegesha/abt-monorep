'use client';

import { useState, useEffect } from 'react';
import { db } from '../db';
import { eq, and } from 'drizzle-orm';
import { shippingRates } from '../schema';
import type { ShippingRate } from '../schema';

interface ShippingRates {
  price_per_kg_composition: string;
  price_per_kg_door: string;
  estimated_delivery_days_min: string;
  estimated_delivery_days_max: string;
  base_cost_composition: string;
  base_cost_door: string;
}

interface ShippingData {
  cities: string[];
  rates: ShippingRates | null;
}

export function useShippingData(startCity: string, endCity: string): [ShippingData, string | null] {
  const [cities, setCities] = useState<string[]>([]);
  const [rates, setRates] = useState<ShippingRates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCities = async () => {
      try {
        const allRates = await db.select().from(shippingRates);
        if (!isMounted) return;

        const uniqueCities = new Set<string>();
        allRates.forEach(rate => {
          uniqueCities.add(rate.startCity);
          uniqueCities.add(rate.endCity);
        });
        
        setCities(Array.from(uniqueCities).sort());
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to fetch cities:', err);
        setError('Failed to load cities. Please try again later.');
      }
    };

    fetchCities();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      if (startCity && endCity) {
        try {
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

          if (!isMounted) return;

          if (rate) {
            setRates({
              price_per_kg_composition: rate.pricePerKgComposition,
              price_per_kg_door: rate.pricePerKgDoor,
              estimated_delivery_days_min: rate.estimatedDeliveryDaysMin,
              estimated_delivery_days_max: rate.estimatedDeliveryDaysMax,
              base_cost_composition: rate.baseCostComposition,
              base_cost_door: rate.baseCostDoor,
            });
          } else {
            setRates(null);
            setError('No shipping rates found for the selected cities.');
          }
        } catch (err) {
          if (!isMounted) return;
          console.error('Failed to fetch shipping rates:', err);
          setError('Failed to load shipping rates. Please try again later.');
        }
      }
    };

    fetchRates();
    return () => { isMounted = false; };
  }, [startCity, endCity]);

  return [{ cities, rates }, error];
} 