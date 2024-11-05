import { NextResponse } from 'next/server';
import { getShippingRates, getBaseCosts, getCitiesList } from '@repo/database';

interface CalculationRequest {
    weight: number;
    length: number | null;
    width: number | null;
    height: number | null;
    startCity: string;
    endCity: string;
    shippingType: 'composition' | 'door';
}

export async function calculateShipping(request: Request) {
    try {
        const body: CalculationRequest = await request.json();

        // Validation
        if (!body.weight || !body.startCity || !body.endCity) {
            return NextResponse.json(
                { message: 'Please fill in all required fields' },
                { status: 400 }
            );
        }

        // Fetch rates and costs
        const [rates, baseCosts] = await Promise.all([
            getShippingRates(body.startCity, body.endCity),
            getBaseCosts()
        ]);

        // Calculate costs
        const pricePerKg = body.shippingType === "composition"
            ? Number(rates.price_per_kg_composition)
            : Number(rates.price_per_kg_door);
        const baseCost = body.shippingType === "composition"
            ? Number(rates.base_cost_composition)
            : Number(rates.base_cost_door);

        // Calculate final cost
        let finalCost = baseCost;
        if (body.weight > 20) {
            finalCost += (body.weight - 20) * pricePerKg;
        }

        if (body.length && body.width && body.height) {
            const volumeWeight = (body.length * body.width * body.height) / 5000;
            const volumeCost = volumeWeight * pricePerKg;
            finalCost = Math.max(volumeCost, finalCost);
        }

        return NextResponse.json({
            finalCost: Math.round(finalCost),
            deliveryEstimate: `${rates.estimated_delivery_days_min}-${rates.estimated_delivery_days_max} дней`
        });

    } catch (error) {
        console.error('Calculation error:', error);
        return NextResponse.json(
            { message: 'Failed to calculate shipping cost' },
            { status: 500 }
        );
    }
}

export async function getCities() {
    try {
        const cities = await getCitiesList();
        return NextResponse.json(cities);
    } catch (error) {
        console.error('Failed to fetch cities:', error);
        return NextResponse.json(
            { message: 'Failed to load cities' },
            { status: 500 }
        );
    }
}

export async function getRates(startCity: string, endCity: string) {
    try {
        const rates = await getShippingRates(startCity, endCity);
        return NextResponse.json(rates);
    } catch (error) {
        console.error('Failed to fetch rates:', error);
        return NextResponse.json(
            { message: 'Failed to load rates' },
            { status: 500 }
        );
    }
} 