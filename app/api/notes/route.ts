import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const notes = await prisma.note.findMany();
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const { title, content } = await req.json();
  const note = await prisma.note.create({
    data: { title, content },
  });
  return NextResponse.json(note);
}