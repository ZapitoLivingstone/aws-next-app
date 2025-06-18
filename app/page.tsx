'use client';

import { useEffect, useState } from 'react';

export default function POSPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);

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

  const total = carrito.reduce((acc, p) => acc + p.cantidad * 1, 0);

  const generarVenta = async () => {
    const res = await fetch('/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos: carrito }),
    });

    if (res.ok) {
      alert('Venta registrada correctamente');
      setCarrito([]);
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
              className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition duration-300 p-4 flex flex-col items-center text-center"
            >
              <div className="w-full h-32 flex items-center justify-center mb-3">
                <img
                  src={producto.imagenUrl}
                  alt={producto.titulo}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h2 className="text-lg font-semibold line-clamp-1">{producto.titulo}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">{producto.descripcion}</p>
              <p className="mt-2 text-sm font-medium text-gray-800">
                Stock disponible: <span className="text-blue-600">{producto.stock}</span>
              </p>
            </div>
          ))}
        </div>
      </div>


      {/* Carrito lateral */}
      <div className="w-[360px] bg-white border-l shadow-lg p-6 flex flex-col justify-between">
        {/* Título */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Venta actual</h2>

          {/* Lista de productos */}
          {carrito.length === 0 ? (
            <p className="text-gray-500 text-sm">Agrega productos al carrito tocando sus tarjetas.</p>
          ) : (
            <ul className="space-y-4">
              {carrito.map((item) => (
                <li key={item.id} className="border rounded-lg p-3 shadow-sm bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.titulo}</p>
                      <p className="text-xs text-gray-500">Stock: {item.stock}</p>
                    </div>
                    <button
                      onClick={() => cambiarCantidad(item.id, 0)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs text-gray-600">Cantidad:</label>
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.cantidad}
                      onChange={(e) =>
                        cambiarCantidad(item.id, parseInt(e.target.value))
                      }
                      className="w-20 border rounded px-2 py-1 mt-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Total y botón */}
        <div className="mt-6 border-t pt-4">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Total productos: <span className="text-blue-700">{total}</span>
          </p>
          <button
            onClick={generarVenta}
            disabled={carrito.length === 0}
            className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Generar venta
          </button>
        </div>
      </div>
    </div>
  );
}
