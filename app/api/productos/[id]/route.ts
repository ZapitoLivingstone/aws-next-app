import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split('/').pop() || '');

  const body = await req.json();

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const producto = await prisma.producto.update({
    where: { id },
    data: {
      titulo: body.titulo,
      descripcion: body.descripcion,
      imagenUrl: body.imagenUrl || '',
      stock: body.stock ?? 0,
    },
  });

  return NextResponse.json(producto);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split('/').pop() || '');

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  await prisma.producto.delete({ where: { id } });

  return NextResponse.json({ message: 'Producto eliminado' });
}
