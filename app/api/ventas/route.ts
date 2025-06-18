import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productos } = body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: 'Venta vacía' }, { status: 400 });
    }

    // Verificar stock disponible
    for (const item of productos) {
      const producto = await prisma.producto.findUnique({ where: { id: item.id } });
      if (!producto || producto.stock < item.cantidad) {
        return NextResponse.json({ error: `Stock insuficiente para ${producto?.titulo || 'producto desconocido'}` }, { status: 400 });
      }
    }

    const total = productos.reduce((acc: number, p: any) => acc + p.cantidad * 1, 0); // puedes reemplazar *1 por precio si lo agregas después

    // Crear venta
    const venta = await prisma.venta.create({
      data: {
        total,
        detalles: {
          create: productos.map((p: any) => ({
            productoId: p.id,
            cantidad: p.cantidad,
            subtotal: p.cantidad * 1, // usar precio si está disponible
          })),
        },
      },
    });

    // Descontar stock
    for (const item of productos) {
      await prisma.producto.update({
        where: { id: item.id },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    return NextResponse.json({ message: 'Venta registrada', venta });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
