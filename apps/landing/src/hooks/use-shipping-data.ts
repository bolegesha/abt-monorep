'use client';

import { useState, useEffect } from 'react';

interface ShippingDataResponse {
  cities: string[];
  rates?: {
    price_per_kg_composition: number;
    price_per_kg_door: number;
    estimated_delivery_days_min: number;
    estimated_delivery_days_max: number;
    base_cost_composition: number;
    base_cost_door: number;
  } | null;
}

export function useShippingData(startCity: string, endCity: string): [ShippingDataResponse, string | null] {
  const [data, setData] = useState<ShippingDataResponse>({ cities: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for development
    const mockCities = [
      'Астана',
      'Алматы',
      'Шымкент',
      'Караганда',
      'Актобе',
      'Тараз',
      'Павлодар',
      'Усть-Каменогорск',
      'Семей',
      'Атырау',
    ];

    setData({ 
      cities: mockCities,
      rates: startCity && endCity ? {
        price_per_kg_composition: 100,
        price_per_kg_door: 150,
        estimated_delivery_days_min: 2,
        estimated_delivery_days_max: 5,
        base_cost_composition: 1000,
        base_cost_door: 1500
      } : null
    });
  }, [startCity, endCity]);

  return [data, error];
} 