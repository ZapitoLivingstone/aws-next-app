import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Sistema de Inventario',
  description: 'Gestión simple de productos y stock',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-800">
        <nav className="bg-blue-800 text-white p-4 flex space-x-6">
          <Link href="/">Productos</Link>
          <Link href="/nuevo-producto">Nuevo producto</Link>
          <Link href="/inventario">Inventario</Link>
          <Link href="/historial">Historial</Link>
        </nav>
        <div className="max-w-5xl mx-auto mt-6">{children}</div>
      </body>
    </html>
  );
}
