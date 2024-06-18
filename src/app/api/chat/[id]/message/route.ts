import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function POST
  (req: NextRequest,
    { params }: { params: { id: string } }
  ) {
  const { id, role, content, questionId, annotations } = await req.json();
  const result = await prisma.message.create({
    data: {
      id,
      role,
      content,
      chatId: params.id,
      questionId: questionId,
      annotations: annotations,
    },
  })
  return NextResponse.json(result, { status: 200 })
}