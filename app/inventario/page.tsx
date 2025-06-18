'use client';

import { useEffect, useState } from 'react';

export default function InventarioPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [modoEdicion, setModoEdicion] = useState<number | null>(null);
  const [form, setForm] = useState({
  titulo: '',
  descripcion: '',
  imagenUrl: '',
  precio: '',   // ahora string
  stock: '',    // ahora string
});


  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  const handleEditar = (producto: any) => {
    setModoEdicion(producto.id);
    setForm({
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      imagenUrl: producto.imagenUrl,
      precio: producto.precio.toString(),  // convierte a string
      stock: producto.stock.toString(),
    });

  };

  const handleGuardar = async () => {
    if (
      !form.titulo.trim() ||
      !form.descripcion.trim() ||
      !form.imagenUrl.trim() ||
      isNaN(Number(form.precio)) ||
      isNaN(Number(form.stock))
    ) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    await fetch(`/api/productos/${modoEdicion}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        precio: parseFloat(form.precio) || 0,
        stock: parseInt(form.stock) || 0,
      }),
    });


    setModoEdicion(null);
    fetchProductos();
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Eliminar producto?')) {
      await fetch(`/api/productos/${id}`, { method: 'DELETE' });
      fetchProductos();
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Inventario</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white border rounded p-4 shadow-sm">
            {modoEdicion === producto.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Título"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Imagen URL"
                  value={form.imagenUrl}
                  onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="w-full border p-2 rounded"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                <button
                  onClick={handleGuardar}
                  className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <>
                <img
                  src={producto.imagenUrl}
                  alt={producto.titulo}
                  className="h-32 w-full object-contain mb-2"
                />
                <h2 className="text-lg font-bold">{producto.titulo}</h2>
                <p className="text-sm text-gray-500">{producto.descripcion}</p>
                <p className="text-sm text-gray-800 mt-1">
                  Precio: ${producto.precio?.toFixed(0)}
                </p>
                <p className="text-sm text-gray-700 mt-1">Stock: {producto.stock}</p>
                <div className="mt-4 flex justify-between text-sm">
                  <button
                    onClick={() => handleEditar(producto)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
