import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const result = await prisma.chat.findMany({
    where: {
      userId:  Number(req.headers.get('userId')),
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      messages: {
        take: 1,
      },
    },
  });
  return NextResponse.json(result, { status: 200 })
}

export async function POST(req: NextRequest) {
  const messages = await req.json();
  const result = await prisma.chat.create({
    data: {
      userId: Number(req.headers.get('userId')),
      messages: {
        createMany: {
          data: messages
        }
      }
    },
  })
  return NextResponse.json(result, { status: 200 })
}

export async function DELETE(req: NextRequest) {
  const result = await prisma.chat.deleteMany({
    where: {
      userId: Number(req.headers.get('userId')),
    },
  })
  return NextResponse.json(result, { status: 200 })
}