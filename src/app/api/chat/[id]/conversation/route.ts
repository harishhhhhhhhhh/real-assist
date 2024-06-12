import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { ApiRequest } from '@/models/ApiRequest';

export const dynamic = "force-dynamic";

export async function POST
  (req: ApiRequest,
    { params }: { params: { id: string } }
  ) {
  const { role, content } = await req.json();
  const result = await prisma.conversation.create({
    data: {
      chatId: params.id,
      role,
      content,
    },
  })
  return NextResponse.json(result, { status: 200 })
}