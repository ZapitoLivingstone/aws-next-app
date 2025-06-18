import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movimientos = await prisma.movimientoInventario.findMany({
      orderBy: { fecha: 'desc' },
      include: {
        producto: true,
      },
    });

    return NextResponse.json(movimientos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener historial' }, { status: 500 });
  }
}
