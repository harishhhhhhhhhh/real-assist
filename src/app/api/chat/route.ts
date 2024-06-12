import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { ApiRequest } from '@/models/ApiRequest';

export const dynamic = "force-dynamic";

export async function GET(req: ApiRequest) {
  const result = await prisma.chat.findMany({
    where: {
      userId:  req.userId,
    },
    include: {
      conversation: {
        take: 1,
      },
    },
  });
  return NextResponse.json(result, { status: 200 })
}

export async function POST(req: ApiRequest) {
  const conversations = await req.json();
  const result = await prisma.chat.create({
    data: {
      userId: req.userId,
      conversation: {
        createMany: {
          data: conversations
        }
      }
    },
  })
  return NextResponse.json(result, { status: 200 })
}