import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await prisma.chat.findUnique({
    where: {
      id: params.id,
      userId: Number(req.headers.get('userId')),
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          documents: true
        }
      }
    },
  });
  return NextResponse.json(result, { status: 200 })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await prisma.chat.delete({
    where: {
      id: params.id,
      userId: Number(req.headers.get('userId')),
    },
  });
  return NextResponse.json(result, { status: 200 })
}