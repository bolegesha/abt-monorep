"use client";

import React, { useState, useMemo } from "react";
import { useShippingData } from "@repo/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalculationResponse {
  finalCost: number;
  deliveryEstimate: string;
}

interface TransportCalculatorProps {
  calculatorType: 'workers' | 'standard';
}

interface ShippingRates {
  price_per_kg_composition: number;
  price_per_kg_door: number;
  estimated_delivery_days_min: number;
  estimated_delivery_days_max: number;
  base_cost_composition: number;
  base_cost_door: number;
}

export default function UnifiedTransportCalculator({ calculatorType }: TransportCalculatorProps) {
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [shippingType, setShippingType] = useState<"composition" | "door">("composition");
  const [finalCost, setFinalCost] = useState<number | null>(null);
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const [{ cities, rates }, fetchError] = useShippingData(startCity, endCity);

  const calculateCost = async () => {
    setCalculationError(null);
    setFinalCost(null);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: parseFloat(weight),
          length: length ? parseFloat(length) : null,
          width: width ? parseFloat(width) : null,
          height: height ? parseFloat(height) : null,
          startCity,
          endCity,
          shippingType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate cost');
      }

      const result = await response.json();
      setFinalCost(result.finalCost);
      setDeliveryEstimate(result.deliveryEstimate);
    } catch (error) {
      setCalculationError(error instanceof Error ? error.message : 'Failed to calculate cost');
    }
  };

  const orderedCities = useMemo(() => {
    if (!cities || !Array.isArray(cities)) return [];

    const primaryCities = ['Астана', 'Алматы'];
    const otherCities = cities
      .filter(city => !primaryCities.includes(city))
      .sort((a, b) => a.localeCompare(b, 'ru'));

    return [...primaryCities, ...otherCities];
  }, [cities]);

  const clear = () => {
    setWeight("");
    setLength("");
    setWidth("");
    setHeight("");
    setStartCity("");
    setEndCity("");
    setShippingType("composition");
    setFinalCost(null);
    setDeliveryEstimate(null);
    setCalculationError(null);
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      {(fetchError || calculationError) && (
        <div className="mb-4 p-3 bg-[#FFF0F0] text-[#FF3B30] text-sm rounded-lg">
          {fetchError || calculationError}
        </div>
      )}

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-[#86868B] mb-1">Город отправки</Label>
            <Select
              value={startCity}
              onValueChange={setStartCity}
              className="w-full"
            >
              <SelectTrigger className="w-full px-3 py-2 bg-[#F5F5F7] border-none rounded-lg focus:ring-2 focus:ring-[#0071E3] transition-colors text-sm">
                <SelectValue placeholder="Выберите город" />
              </SelectTrigger>
              <SelectContent>
                {orderedCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium text-[#86868B] mb-1">Город назначения</Label>
            <Select
              value={endCity}
              onValueChange={setEndCity}
              className="w-full"
            >
              <SelectTrigger className="w-full px-3 py-2 bg-[#F5F5F7] border-none rounded-lg focus:ring-2 focus:ring-[#0071E3] transition-colors text-sm">
                <SelectValue placeholder="Выберите город" />
              </SelectTrigger>
              <SelectContent>
                {orderedCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-[#86868B] mb-1">Вес (кг)</Label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 bg-[#F5F5F7] border-none rounded-lg focus:ring-2 focus:ring-[#0071E3] transition-colors text-sm"
            placeholder="Enter weight"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            {label: "Длина (см)", value: length, setter: setLength},
            {label: "Ширина (см)", value: width, setter: setWidth},
            {label: "Высота (см)", value: height, setter: setHeight},
          ].map((dim) => (
            <div key={dim.label}>
              <Label className="block text-sm font-medium text-[#86868B] mb-1">{dim.label}</Label>
              <Input
                type="number"
                value={dim.value}
                onChange={(e) => dim.setter(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F5F7] border-none rounded-lg focus:ring-2 focus:ring-[#0071E3] transition-colors text-sm"
                placeholder="Optional"
              />
            </div>
          ))}
        </div>

        <div>
          <Label className="block text-sm font-medium text-[#86868B] mb-2">Тип доставки</Label>
          <div className="flex space-x-6">
            {[
              {value: "composition", label: "До склада"},
              {value: "door", label: "До двери"}
            ].map((type) => (
              <label key={type.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value={type.value}
                  checked={shippingType === type.value}
                  onChange={(e) => setShippingType(e.target.value as "composition" | "door")}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 mr-2 border-2 rounded-full flex items-center justify-center ${
                    shippingType === type.value ? 'border-[#0071E3] bg-[#00358E]' : 'border-[#86868B]'
                  }`}
                >
                  {shippingType === type.value && <span className="w-2 h-2 bg-white rounded-full"></span>}
                </span>
                <span className="text-sm text-[#00358E]">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={calculateCost}
            className="flex-1 bg-[#00358E] text-white py-2 px-4 rounded-lg hover:bg-[#0077ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-opacity-50 text-sm"
          >
            Посчитать
          </Button>
          <Button
            onClick={clear}
            className="flex-1 bg-[#F5F5F7] text-[#00358E] py-2 px-4 rounded-lg hover:bg-[#E8E8ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-opacity-50 text-sm"
          >
            Очистить
          </Button>
        </div>

        {finalCost !== null && deliveryEstimate && (
          <div className="mt-6 p-4 bg-[#F5F5F7] rounded-lg">
            <p className="text-xl font-semibold text-[#1D1D1F] mb-2">
              Стоимость доставки: <span className="text-[#00358E]">{finalCost} тенге</span>
            </p>
            <p className="text-sm text-[#00358E]">
              Ожидаемое время доставки: <span className="font-medium">{deliveryEstimate}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
