import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Delete all existing demo/seed orders
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});

    return NextResponse.json({ message: 'All demo orders cleared successfully' });
  } catch (error: any) {
    console.error('Clear orders error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
