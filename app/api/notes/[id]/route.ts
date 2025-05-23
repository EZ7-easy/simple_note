import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  await prisma.note.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Note deleted' });
}