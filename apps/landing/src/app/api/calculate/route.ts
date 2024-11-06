import { NextResponse } from 'next/server';
import { db } from '@repo/database';
import { shippingRoutes, baseCosts } from '@repo/database';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';  // Change import to specific database type

interface CalculationRequest {
  weight: number;
  length: number | null;
  width: number | null;
  height: number | null;
  startCity: string;
  endCity: string;
  shippingType: 'composition' | 'door';
}

export async function POST(request: Request) {
  try {
    const body: CalculationRequest = await request.json();

    if (!body.weight || !body.startCity || !body.endCity) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    } 

    // Get shipping rates using raw SQL conditions
    const [route] = await db
      .select()
      .from(shippingRoutes)
      .where(sql`${shippingRoutes.startCity} = ${body.startCity} AND ${shippingRoutes.endCity} = ${body.endCity}`);

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

    // Calculate cost by weight
    let costByWeight = body.weight <= 25
      ? baseCost
      : baseCost + (body.weight - 25) * pricePerKg;

    // Calculate cost by volume if dimensions are provided
    let finalCost = costByWeight;
    if (body.length && body.width && body.height) {
      const volumeWeight = (body.length * body.width * body.height) / 5000;
      const volumeCost = volumeWeight * pricePerKg;
      finalCost = Math.max(volumeCost, costByWeight);
    }

    return NextResponse.json({
      finalCost: Math.round(finalCost),
      deliveryEstimate: `от ${route.estimatedDeliveryDaysMin} до ${route.estimatedDeliveryDaysMax} дней`
    });

  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to calculate shipping cost' },
      { status: 500 }
    );
  }
}