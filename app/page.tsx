'use client';

import { useEffect, useState } from 'react';

export default function POSPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [metodoPago, setMetodoPago] = useState<string>('efectivo');
  const [efectivoRecibido, setEfectivoRecibido] = useState<string>('');

  useEffect(() => {
    fetch('/api/productos')
      .then((res) => res.json())
      .then(setProductos);
  }, []);

  const agregarAlCarrito = (producto: any) => {
    const existente = carrito.find((p) => p.id === producto.id);
    if (existente) {
      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      setCarrito(carrito.filter((p) => p.id !== id));
    } else {
      setCarrito(
        carrito.map((p) =>
          p.id === id ? { ...p, cantidad: nuevaCantidad } : p
        )
      );
    }
  };

  const total = carrito.reduce((acc, p) => acc + p.cantidad * p.precio, 0);
  const efectivo = parseFloat(efectivoRecibido);
  const vuelto = metodoPago === 'efectivo' && efectivo ? efectivo - total : 0;

  const generarVenta = async () => {
    if (metodoPago === 'efectivo' && vuelto < 0) {
      alert('El efectivo recibido es insuficiente.');
      return;
    }

    const res = await fetch('/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productos: carrito,
        metodoPago,
        efectivoRecibido: metodoPago === 'efectivo' ? efectivo : null,
        vuelto: metodoPago === 'efectivo' ? vuelto : null,
      }),
    });

    if (res.ok) {
      alert('Venta registrada correctamente');
      setCarrito([]);
      setEfectivoRecibido('');
    } else {
      const error = await res.json();
      alert('Error: ' + (error.error || 'No se pudo completar la venta'));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Zona de productos */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              onClick={() => agregarAlCarrito(producto)}
              className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer p-4 text-center"
            >
              <div className="h-32 flex items-center justify-center mb-3">
                <img
                  src={producto.imagenUrl}
                  alt={producto.titulo}
                  className="max-h-full object-contain"
                />
              </div>
              <h2 className="text-lg font-bold">{producto.titulo}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{producto.descripcion}</p>
              <p className="text-sm text-gray-800 mt-1">Precio: ${producto.precio}</p>
              <p className="text-xs text-blue-600">Stock: {producto.stock}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito lateral */}
      <div className="w-[360px] bg-white border-l shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Venta actual</h2>

          {carrito.length === 0 ? (
            <p className="text-sm text-gray-500">Agrega productos al carrito.</p>
          ) : (
            <ul className="space-y-4 mb-4">
              {carrito.map((item) => (
                <li key={item.id} className="bg-gray-50 border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{item.titulo}</p>
                      <p className="text-xs text-gray-500">Precio: ${item.precio}</p>
                    </div>
                    <button
                      onClick={() => cambiarCantidad(item.id, 0)}
                      className="text-red-500 text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs">Cantidad:</label>
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.cantidad}
                      onChange={(e) =>
                        cambiarCantidad(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-20 border rounded px-2 py-1 mt-1 text-sm text-center"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mb-3">
            <label className="text-sm font-medium">Método de pago:</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full border p-2 mt-1 rounded text-sm"
            >
              <option value="efectivo">Efectivo</option>
              <option value="debito">Débito</option>
              <option value="credito">Crédito</option>
            </select>
          </div>

          {metodoPago === 'efectivo' && (
            <div className="mb-4">
              <label className="text-sm font-medium">Efectivo recibido:</label>
              <input
                type="number"
                className="w-full border p-2 mt-1 rounded text-sm"
                value={efectivoRecibido}
                onChange={(e) => setEfectivoRecibido(e.target.value)}
              />
              {efectivoRecibido && (
                <p className="text-xs mt-1">
                  Vuelto:{" "}
                  <span className={vuelto < 0 ? 'text-red-500' : 'text-green-600'}>
                    ${vuelto.toFixed(0)}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Total y botón */}
        <div className="border-t pt-4">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Total: ${total.toFixed(0)}
          </p>
          <button
            onClick={generarVenta}
            disabled={carrito.length === 0}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded disabled:opacity-50"
          >
            Generar venta
          </button>
        </div>
      </div>
    </div>
  );
}
