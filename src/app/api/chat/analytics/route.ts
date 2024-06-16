import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const result = await prisma.message.findMany({
    where: {
      data: {
        not: null
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
  });
    return NextResponse.json(result, { status: 200 })
  }