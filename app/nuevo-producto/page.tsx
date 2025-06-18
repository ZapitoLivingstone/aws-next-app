'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoProducto() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const validarFormulario = () => {
    if (titulo.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres.');
      return false;
    }
    if (descripcion.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres.');
      return false;
    }
    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      setError('El stock debe ser un número mayor o igual a 0.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setCargando(true);

    const res = await fetch('/api/productos', {
      method: 'POST',
      body: JSON.stringify({
        titulo,
        descripcion,
        imagenUrl,
        stock: parseInt(stock),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    setCargando(false);
    if (res.ok) {
      router.push('/inventario');
    } else {
      alert('Error al crear producto');
    }
  };

  return (
    <main className="max-w-2xl mx-auto mt-12 px-6 py-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Agregar Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-600 font-medium">{error}</p>}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
          <input
            type="text"
            placeholder="Ej. Macetero Cerámico"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
          <textarea
            placeholder="Ej. Macetero artesanal ideal para suculentas"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 resize-none"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">URL de la Imagen</label>
          <input
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Inicial</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-all disabled:opacity-50"
          >
            {cargando ? 'Guardando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </main>
  );
}
