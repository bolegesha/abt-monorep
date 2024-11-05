import { getRates } from '@repo/api/routes/shipping';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const startCity = searchParams.get('startCity');
    const endCity = searchParams.get('endCity');

    if (!startCity || !endCity) {
        return new Response('Missing required parameters', { status: 400 });
    }

    return getRates(startCity, endCity);
} 