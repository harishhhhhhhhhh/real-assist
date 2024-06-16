import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function PATCH
  (req: NextRequest,
    { params }: {
      params: { id: string }
    }
  ) {
  const { feedback } = await req.json();
  const result = await prisma.message.update({
    where: {
      id: params.id,
    },
    data: {
      data: {
        feedback
      }
    },
  })
  return NextResponse.json(result, { status: 200 })
}