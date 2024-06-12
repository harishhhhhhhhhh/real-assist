import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { ApiRequest } from '@/models/ApiRequest';

export const dynamic = "force-dynamic";

export async function GET(
  req: ApiRequest,
  { params }: { params: { id: string } }
) {
  const result = await prisma.chat.findUnique({
    where: {
      id: params.id,
      userId: req.userId,
    },
    include: {
      conversation: true,
    },
  });
  return NextResponse.json(result, { status: 200 })
}

export async function DELETE(
  req: ApiRequest,
  { params }: { params: { id: string } }
) {
  const result = await prisma.chat.delete({
    where: {
      id: params.id,
    },
  });
  return NextResponse.json(result, { status: 200 })
}