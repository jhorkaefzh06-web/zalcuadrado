import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';
import { BrandLogo } from '@/components/Navbar';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-brand-950 text-brand-300 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <BrandLogo />
            <p className="text-sm text-brand-400 leading-relaxed pt-2">
              Hielo gourmet en esferas, cubos macizos, whiskies de colección, vinos reservas y licores de alta gama con delivery express las 24 horas.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/productos?category=hielos" className="hover:text-amber-400 transition-colors">Hielos</Link>
              </li>
              <li>
                <Link href="/productos?category=bebidas" className="hover:text-amber-400 transition-colors">Bebidas</Link>
              </li>
              <li>
                <Link href="/productos?filter=promo" className="hover:text-amber-400 transition-colors">Promociones</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Servicios & Delivery</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/servicios" className="hover:text-amber-400 transition-colors">Delivery Express 24/7 en Frío</Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-amber-400 transition-colors">Hielos Gourmet para Eventos</Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-amber-400 transition-colors">Sommelier & Catas Privadas</Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-amber-400 transition-colors">Catering para Bodas & Fiestas</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Atención & Pedidos</h3>
            <ul className="space-y-3.5 text-sm text-brand-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>Av. Las Cavas 450, Miraflores<br />Lima - Perú</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>+51 987 654 321 (Atención 24/7)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <a href="mailto:pedidos@zetaspirits.com" className="hover:text-amber-400 transition-colors">
                  pedidos@zetaspirits.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer (+18 Warning) */}
        <div className="mt-10 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs flex items-center justify-center space-x-2 text-center">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <p className="font-semibold">
            TOMAR BEBIDAS ALCOHÓLICAS EN EXCESO ES DAÑINO. PROHIBIDA LA VENTA DE BEBIDAS ALCOHÓLICAS A MENORES DE 18 AÑOS.
          </p>
        </div>

        <div className="border-t border-brand-800/80 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-400">
          <p>&copy; {currentYear} Hielos & Bebidas Z². Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Términos de Compra</a>
            <a href="#" className="hover:text-white transition-colors">Política de Envíos</a>
            <a href="#" className="hover:text-white transition-colors">Libro de Reclamaciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
