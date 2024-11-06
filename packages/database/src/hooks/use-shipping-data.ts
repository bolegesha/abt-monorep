'use client';

import { useState, useEffect } from 'react';
import { getShippingRates, getCitiesList } from '../lib/shipping';

interface ShippingData {
  cities: string[];
  rates: {
    price_per_kg_composition: number;
    price_per_kg_door: number;
    estimated_delivery_days_min: number;
    estimated_delivery_days_max: number;
    base_cost_composition: number;
    base_cost_door: number;
  } | null;
}

export function useShippingData(startCity?: string, endCity?: string) {
  const [data, setData] = useState<ShippingData>({ cities: [], rates: null });
  const [error, setError] = useState<string | null>(null);

  // Fetch cities
  useEffect(() => {
    async function fetchCities() {
      try {
        const citiesList = await getCitiesList();
        setData(prev => ({ ...prev, cities: citiesList }));
      } catch (err) {
        setError('Failed to load cities');
        console.error('Error fetching cities:', err);
      }
    }

    fetchCities();
  }, []);

  // Fetch rates when both cities are selected
  useEffect(() => {
    async function fetchRates() {
      if (startCity && endCity) {
        try {
          const rates = await getShippingRates(startCity, endCity);
          setData(prev => ({ ...prev, rates }));
        } catch (err) {
          setError('Failed to load shipping rates');
          console.error('Error fetching rates:', err);
        }
      }
    }

    fetchRates();
  }, [startCity, endCity]);

  return [data, error] as const;
} 