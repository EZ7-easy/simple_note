import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  params: {
    id: string;
  };
};3

export async function DELETE(
  _req: NextRequest,
  { params }: Params
) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Note deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
