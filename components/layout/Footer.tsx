import Link from 'next/link';

export default function Footer() {
  const navigationLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Inventario', href: '/inventario' },
    { label: 'Almacenamiento', href: '/almacenamiento' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Cotizar', href: '/cotizar' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Necesitas espacio para tu negocio?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cotizar"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Cotizar Ahora
            </Link>
            <Link
              href="/inventario"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Stock Disponible
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">SMI Contenedores</h3>
            <p className="text-gray-400 text-sm">
              Soluciones de almacenamiento y contenedores para tu negocio.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Teléfono: +52 (XXX) XXX-XXXX</li>
              <li>Email: info@smicontenedores.com</li>
              <li>Dirección: Ciudad, Estado, País</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SMI Contenedores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
