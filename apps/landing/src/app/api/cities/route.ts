import { db } from '@repo/database';
import { shippingRoutes } from '@repo/database';

export async function GET() {
  try {
    const citiesResult = await db
      .select({ city: shippingRoutes.startCity })
      .from(shippingRoutes)
      .union(
        db.select({ city: shippingRoutes.endCity }).from(shippingRoutes)
      );

    const cities = Array.from(new Set(citiesResult.map(result => result.city)));
    return Response.json(cities);
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return Response.json(
      { message: 'Failed to load cities' },
      { status: 500 }
    );
  }
} 