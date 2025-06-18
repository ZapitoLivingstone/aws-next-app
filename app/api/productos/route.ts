import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const productos = await prisma.producto.findMany();
  return NextResponse.json(productos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Asegurarse de que el stock sea un número
  const stockInicial = parseInt(body.stock);
  const stock = isNaN(stockInicial) ? 0 : stockInicial;

  const nuevo = await prisma.producto.create({
    data: {
      titulo: body.titulo,
      descripcion: body.descripcion,
      imagenUrl: body.imagenUrl || '',
      stock: stock,
    },
  });

  return NextResponse.json(nuevo);
}
