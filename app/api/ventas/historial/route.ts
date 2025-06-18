// app/api/ventas/historial/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const desde = searchParams.get('desde');
  const hasta = searchParams.get('hasta');
  const ordenar = searchParams.get('ordenar'); // opciones: 'mas-vendidos', 'menos-vendidos'

  const filtros: any = {};
  if (desde && hasta) {
    filtros.fecha = {
      gte: new Date(desde),
      lte: new Date(hasta),
    };
  }

  const ventas = await prisma.venta.findMany({
    where: filtros,
    include: {
      detalles: {
        include: { producto: true },
      },
    },
  });

  // Estadísticas adicionales
  const popularidad = await prisma.detalleVenta.groupBy({
    by: ['productoId'],
    _sum: { cantidad: true },
    orderBy:
      ordenar === 'mas-vendidos'
        ? { _sum: { cantidad: 'desc' } }
        : ordenar === 'menos-vendidos'
        ? { _sum: { cantidad: 'asc' } }
        : undefined,
  });

  return NextResponse.json({ ventas, popularidad });
}
