'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export const DEFAULT_BANNERS = [
  {
    id: 'b1',
    image_url: '/whiskey_ice_banner.png',
    href: '/productos?filter=promo'
  }
];

export default function UnicornStudioHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { banners } = useBanners();

  const slides = banners.length > 0 
    ? banners 
    : DEFAULT_BANNERS;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] mt-20 md:mt-24 select-none">
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-brand-950/20 border border-white/5">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect={'fade'}
          fadeEffect={{ crossFade: true }}
          speed={800}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-brand-400 !opacity-50 hover:!opacity-100 transition-all duration-300',
            bulletActiveClass: '!bg-amber-400 !opacity-100 !w-8 rounded-full',
          }}
          navigation={{
            nextEl: '.hero-swiper-button-next',
            prevEl: '.hero-swiper-button-prev',
          }}
          loop={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full absolute inset-0"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={slide.id || idx} className="relative w-full h-full flex items-center justify-center">
              <Link
                href={slide.href || '#'}
                className="absolute inset-0 block w-full h-full z-10 group overflow-hidden"
              >
                <img
                  src={slide.image_url}
                  alt="Promotional Banner"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Ambient Radial Background Glow */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-1000 z-20"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 80%)'
                  }}
                />
                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-brand-950/20 group-hover:bg-brand-950/10 transition-colors duration-300 z-15" />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Premium Glassmorphic Navigation Buttons */}
        <button
          className="hero-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-brand-950/40 text-brand-300 backdrop-blur-md hover:bg-brand-900/60 hover:text-white transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          className="hero-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-brand-950/40 text-brand-300 backdrop-blur-md hover:bg-brand-900/60 hover:text-white transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
