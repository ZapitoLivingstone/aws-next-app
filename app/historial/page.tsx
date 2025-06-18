'use client';

import { useEffect, useState } from 'react';

export default function HistorialPage() {
  const [ventas, setVentas] = useState([]);
  const [ordenar, setOrdenar] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => {
    fetchVentas();
  }, [ordenar]);

  const fetchVentas = async () => {
    const params = new URLSearchParams();
    if (desde && hasta) {
      params.append('desde', desde);
      params.append('hasta', hasta);
    }
    if (ordenar) {
      params.append('ordenar', ordenar);
    }

    const res = await fetch(`/api/ventas/historial?${params.toString()}`);
    const data = await res.json();
    setVentas(data.ventas);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="date"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={ordenar}
          onChange={(e) => setOrdenar(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Ordenar por --</option>
          <option value="mas-vendidos">Más vendidos</option>
          <option value="menos-vendidos">Menos vendidos</option>
        </select>
        <button
          onClick={fetchVentas}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filtrar
        </button>
      </div>

      <ul className="space-y-4">
        {ventas.map((venta: any) => (
          <li key={venta.id} className="border rounded p-4 shadow">
            <h2 className="text-lg font-semibold">Venta #{venta.id}</h2>
            <p className="text-sm text-gray-500">
              Fecha: {new Date(venta.fecha).toLocaleString()} - Total: ${venta.total.toFixed(0)}
            </p>
            <ul className="mt-2 pl-4 list-disc">
              {venta.detalles.map((d: any) => (
                <li key={d.id}>
                  {d.producto.titulo} x {d.cantidad} = ${d.subtotal.toFixed(0)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
