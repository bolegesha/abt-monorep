import { getCities } from '@repo/api/routes/shipping';

export async function GET() {
    return getCities();
} 