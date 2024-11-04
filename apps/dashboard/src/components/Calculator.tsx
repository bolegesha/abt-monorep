"use client";

import React, { useState, useMemo } from "react";
import { useShippingData } from "@repo/database";
import type { ShippingRates } from "@repo/database/src/schema";

export default function WCalculator() {
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

    const [{ rates, startCities, endCities }, fetchError] = useShippingData(startCity, endCity);

    const calculateCost = () => {
        setCalculationError(null);
        setFinalCost(null);

        if (!rates || !weight) {
            setCalculationError("Please fill in all required fields and ensure shipping rates are loaded.");
            return;
        }

        const calculatedWeight = parseFloat(weight);
        if (isNaN(calculatedWeight) || calculatedWeight <= 0) {
            setCalculationError("Please enter a valid weight");
            return;
        }

        const pricePerKg = shippingType === "composition"
            ? rates.price_per_kg_composition
            : rates.price_per_kg_door;
        const baseCost = shippingType === "composition"
            ? rates.base_cost_composition
            : rates.base_cost_door;

        let costByWeight = 0;
        if (calculatedWeight <= 20) {
            costByWeight = Number(baseCost);
        } else {
            costByWeight = Number(baseCost) + (calculatedWeight - 20) * Number(pricePerKg);
        }

        if (length && width && height) {
            const volumeWeight = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / 5000;
            const volumeCost = volumeWeight * Number(pricePerKg);
            setFinalCost(Math.round(Math.max(volumeCost, costByWeight)));
        } else {
            setFinalCost(Math.round(costByWeight));
        }

        setDeliveryEstimate(
            `от ${rates.estimated_delivery_days_min} до ${rates.estimated_delivery_days_max} дней`
        );
    };

    const orderedStartCities = useMemo(() => {
        if (!startCities || !Array.isArray(startCities)) return [];

        const primaryCities = ['Астана', 'Алматы'];
        const otherCities = startCities
            .filter(city => !primaryCities.includes(city))
            .sort((a, b) => a.localeCompare(b, 'ru'));

        return [...primaryCities, ...otherCities];
    }, [startCities]);

    const orderedEndCities = useMemo(() => {
        if (!endCities || !Array.isArray(endCities)) return [];

        const primaryCities = ['Астана', 'Алматы'];
        const otherCities = endCities
            .filter(city => !primaryCities.includes(city))
            .sort((a, b) => a.localeCompare(b, 'ru'));

        return [...primaryCities, ...otherCities];
    }, [endCities]);

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
        <div className="bg-white rounded-lg shadow-sm">
            {(fetchError || calculationError) && (
                <div className="mb-4 p-3 bg-[#FFF0F0] text-[#FF3B30] text-sm rounded-lg">
                    {fetchError || calculationError}
                </div>
            )}

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#86868B] mb-1">Город отправки</label>
                        <select
                            value={startCity}
                            onChange={(e) => setStartCity(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F5F7] border-none rounded-lg focus:ring-2 focus:ring-[#0071E3] transition-colors text-sm"
                        >
                            <option value="">Выберите город</option>
                            {orderedStartCities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#86868B] mb-1">Город назначения</label>
                        <select
                            value={endCity}
                            onChange={(e) => setEndCity(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F5F7] border-none rounded-lg focus:ring-2 focus:ring-[#0071E3] transition-colors text-sm"
                        >
                            <option value="">Выберите город</option>
                            {orderedEndCities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#86868B] mb-1">Вес (кг)</label>
                    <input
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
                            <label className="block text-sm font-medium text-[#86868B] mb-1">{dim.label}</label>
                            <input
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
                    <label className="block text-sm font-medium text-[#86868B] mb-2">Тип доставки</label>
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
                    <button
                        onClick={calculateCost}
                        className="flex-1 bg-[#00358E] text-white py-2 px-4 rounded-lg hover:bg-[#0077ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-opacity-50 text-sm"
                    >
                        Посчитать
                    </button>
                    <button
                        onClick={clear}
                        className="flex-1 bg-[#F5F5F7] text-[#00358E] py-2 px-4 rounded-lg hover:bg-[#E8E8ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:ring-opacity-50 text-sm"
                    >
                        Очистить
                    </button>
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
            </div>
        </div>
    );
}
