import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function POST
  (req: NextRequest,
    { params }: { params: { id: string } }
  ) {
  const { role, content } = await req.json();
  const result = await prisma.message.create({
    data: {
      chatId: params.id,
      role,
      content,
    },
  })
  return NextResponse.json(result, { status: 200 })
}