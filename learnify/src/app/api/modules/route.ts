import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || "cm7ltbgxy000075zz07dd8nm5";
  const modules = await prisma.videoModule.findMany({
    where: { userId },
    select: { id: true, name: true },
  });
  return NextResponse.json(modules);
}