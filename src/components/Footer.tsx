import Link from 'next/link';
import { Phone, MapPin, ShieldAlert } from 'lucide-react';
import { BrandLogo } from '@/components/Navbar';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-gradient-to-br from-cyan-950/50 via-blue-950/30 to-brand-950/60 border-t border-cyan-500/35 backdrop-blur-lg text-brand-300 shadow-[0_-15px_45px_rgba(6,182,212,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <BrandLogo />
            <p className="text-sm text-brand-400 leading-relaxed pt-2">
              Somos tu proveedor de confianza, disponibles las 24 horas. Abastecemos tu negocio o evento con hielos de primera calidad y un catálogo completo de licores premium. Ventas al por mayor con distribución eficiente y delivery express para que tu barra nunca se detenga.
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
                <Link href="/servicios" className="hover:text-amber-400 transition-colors">Delivery las 24 horas</Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-amber-400 transition-colors">Hielos por medidas</Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-amber-400 transition-colors">Mayorista</Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-amber-400 transition-colors">Precios accesibles</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Atención & Pedidos</h3>
            <ul className="space-y-3.5 text-sm text-brand-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>AV. 15 de Julio, Huaycán<br />ATE - LIMA - PERÚ</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>+51 961 806 622</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <a href="https://www.facebook.com/HielosCubitos" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  Hielos Cubitos
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
