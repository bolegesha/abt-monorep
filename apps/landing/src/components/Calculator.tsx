'use client';

import React, { useState, useMemo, useEffect } from "react";
import { useShippingData } from "@/hooks/use-shipping-data";

interface ShippingRates {
    price_per_kg_composition: number;
    price_per_kg_door: number;
    estimated_delivery_days_min: number;
    estimated_delivery_days_max: number;
    base_cost_composition: number;
    base_cost_door: number;
}

interface CalculationResponse {
    finalCost: number;
    deliveryEstimate: string;
}

interface TransportCalculatorProps {
    calculatorType: 'workers' | 'standard';
}

export default function UnifiedTransportCalculator({ calculatorType }: TransportCalculatorProps) {
    const [weight, setWeight] = useState("");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [startCity, setStartCity] = useState("");
    const [endCity, setEndCity] = useState("");
    const [shippingType, setShippingType] = useState<"composition" | "door">("composition");
    const [calculationResult, setCalculationResult] = useState<CalculationResponse | null>(null);
    const [calculationError, setCalculationError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cities, setCities] = useState<string[]>([]);

    const [{ cities: fetchedCities, rates }, fetchError] = useShippingData(startCity, endCity);

    useEffect(() => {
        if (fetchedCities) {
            setCities(fetchedCities);
            setIsLoading(false);
        }
    }, [fetchedCities]);

    const orderedCities = useMemo(() => {
        const primaryCities = ['Астана', 'Алматы'];
        const otherCities = cities
            .filter(city => !primaryCities.includes(city))
            .sort((a, b) => a.localeCompare(b, 'ru'));

        return [...primaryCities, ...otherCities];
    }, [cities]);

    const calculateCost = async () => {
        setCalculationError(null);
        setCalculationResult(null);
        setIsLoading(true);

        try {
            if (!weight || !startCity || !endCity) {
                throw new Error('Please fill in all required fields');
            }

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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to calculate shipping cost');
            }

            const result = await response.json();
            setCalculationResult(result);
        } catch (error) {
            console.error('Calculation error:', error);
            setCalculationError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const clear = () => {
        setWeight("");
        setLength("");
        setWidth("");
        setHeight("");
        setStartCity("");
        setEndCity("");
        setShippingType("composition");
        setCalculationResult(null);
        setCalculationError(null);
    };

    // if (isLoading) {
    //     return (
    //         <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
    //             <div className="bg-white p-8 rounded-xl shadow-lg">
    //                 <h2 className="text-xl text-gray-600 mb-4">
    //                     Loading calculator...
    //                 </h2>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-3xl shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-semibold mb-8 sm:mb-12 text-center text-[#1D1D1F]">
                    {calculatorType === 'workers' ? 'Workers Transport Calculator' : 'Калькулятор доставки'}
                </h1>
                {(fetchError || calculationError) && (
                    <div className="mb-8 p-4 bg-[#FFF0F0] text-[#FF3B30] text-sm rounded-xl">
                        {fetchError || calculationError}
                    </div>
                )}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#86868B] mb-2">Город отправки</label>
                            <select
                                value={startCity}
                                onChange={(e) => setStartCity(e.target.value)}
                                className="w-full px-4 py-3 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-colors"
                            >
                                <option value="">Выберите город</option>
                                {orderedCities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#86868B] mb-2">Город назначения</label>
                            <select
                                value={endCity}
                                onChange={(e) => setEndCity(e.target.value)}
                                className="w-full px-4 py-3 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-colors"
                            >
                                <option value="">Выберите город</option>
                                {orderedCities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#86868B] mb-2">Вес (кг)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-colors"
                            placeholder="Введите вес"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            {label: "Длина (cм)", value: length, setter: setLength},
                            {label: "Ширина (cм)", value: width, setter: setWidth},
                            {label: "Высота (cм)", value: height, setter: setHeight},
                        ].map((dim) => (
                            <div key={dim.label}>
                                <label className="block text-sm font-medium text-[#86868B] mb-2">{dim.label}</label>
                                <input
                                    type="number"
                                    value={dim.value}
                                    onChange={(e) => dim.setter(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-colors"
                                    placeholder="Опционально"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#86868B] mb-4">Тип доставки</label>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
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
                                        className={`w-6 h-6 mr-3 border-2 rounded-full flex items-center justify-center ${shippingType === type.value ? 'border-[#0071E3] bg-[#00358E]' : 'border-[#86868B]'}`}>
                                        {shippingType === type.value &&
                                            <span className="w-2 h-2 bg-white rounded-full"></span>}
                                    </span>
                                    <span className="text-sm text-[#00358E]">{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
                        <button
                            onClick={calculateCost}
                            disabled={isLoading}
                            className="flex-1 bg-[#00358E] text-white py-3 px-6 rounded-full hover:bg-[#0077ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-opacity-50 disabled:opacity-50"
                        >
                            {isLoading ? 'Вычисление...' : 'Посчитать'}
                        </button>
                        <button
                            onClick={clear}
                            disabled={isLoading}
                            className="flex-1 bg-[#F5F5F7] text-[#00358E] py-3 px-6 rounded-full hover:bg-[#E8E8ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-opacity-50 disabled:opacity-50"
                        >
                            Очистить
                        </button>
                    </div>
                </div>
                {calculationResult && (
                    <div className="mt-12 p-8 bg-[#F5F5F7] rounded-2xl">
                        <p className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] mb-3">
                            Стоимость доставки: <span className="text-[#00358E]">{calculationResult.finalCost} тенге</span>
                        </p>
                        <p className="text-sm text-[#00358E]">
                            Ожидаемое время доставки: <span className="font-medium">{calculationResult.deliveryEstimate}</span>
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}