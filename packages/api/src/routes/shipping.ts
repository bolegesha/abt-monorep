import { NextResponse } from 'next/server';
import { db } from '@repo/database';
import { shippingRoutes, baseCosts } from '@repo/database/src/schema';
import { and, eq } from 'drizzle-orm';

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
    const body = await request.json() as CalculationRequest;

    if (!body.weight || !body.startCity || !body.endCity) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Get shipping rates
    const [route] = await db
      .select()
      .from(shippingRoutes)
      .where(and(
        eq(shippingRoutes.startCity, body.startCity),
        eq(shippingRoutes.endCity, body.endCity)
      ));

    if (!route) {
      return NextResponse.json(
        { message: 'No shipping rates found for this route' },
        { status: 404 }
      );
    }

    // Get base costs
    const [costs] = await db.select().from(baseCosts);

    if (!costs) {
      return NextResponse.json(
        { message: 'Base costs not found' },
        { status: 404 }
      );
    }

    const pricePerKg = body.shippingType === "composition"
      ? Number(route.pricePerKgComposition)
      : Number(route.pricePerKgDoor);
    
    const baseCost = body.shippingType === "composition"
      ? Number(costs.baseCostComposition)
      : Number(costs.baseCostDoor);

    // Calculate final cost
    let finalCost = baseCost;
    if (body.weight > 25) {
      finalCost += (body.weight - 25) * pricePerKg;
    }

    if (body.length && body.width && body.height) {
      const volumeWeight = (body.length * body.width * body.height) / 5000;
      const volumeCost = volumeWeight * pricePerKg;
      finalCost = Math.max(volumeCost, finalCost);
    }

    return NextResponse.json({
      finalCost: Math.round(finalCost),
      deliveryEstimate: `${route.estimatedDeliveryDaysMin}-${route.estimatedDeliveryDaysMax} дней`
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
    const citiesResult = await db
      .select({ city: shippingRoutes.startCity })
      .from(shippingRoutes)
      .union(
        db.select({ city: shippingRoutes.endCity }).from(shippingRoutes)
      );

    const cities = Array.from(new Set(citiesResult.map((result: { city: string }) => result.city)));
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
    const [route] = await db
      .select()
      .from(shippingRoutes)
      .where(and(
        eq(shippingRoutes.startCity, startCity),
        eq(shippingRoutes.endCity, endCity)
      ));

    if (!route) {
      return NextResponse.json(
        { message: 'No shipping rates found for this route' },
        { status: 404 }
      );
    }

    const [costs] = await db.select().from(baseCosts);

    if (!costs) {
      return NextResponse.json(
        { message: 'Base costs not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      price_per_kg_composition: Number(route.pricePerKgComposition),
      price_per_kg_door: Number(route.pricePerKgDoor),
      estimated_delivery_days_min: route.estimatedDeliveryDaysMin,
      estimated_delivery_days_max: route.estimatedDeliveryDaysMax,
      base_cost_composition: Number(costs.baseCostComposition),
      base_cost_door: Number(costs.baseCostDoor),
    });
  } catch (error) {
    console.error('Failed to fetch rates:', error);
    return NextResponse.json(
      { message: 'Failed to load rates' },
      { status: 500 }
    );
  }
} 