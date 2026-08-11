'use client';

import Link from 'next/link';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const DEFAULT_BANNERS = [
  {
    id: 'b1',
    image_url: '/whiskey_ice_banner.png',
    href: '/productos?filter=promo'
  },
  {
    id: 'b2',
    image_url: '/new-background.png',
    href: '/productos'
  },
  {
    id: 'b3',
    image_url: '/hielos-background.jpg',
    href: '/productos'
  }
];

export default function UnicornStudioHero() {
  const { banners } = useBanners();

  const baseSlides = banners.length > 0 
    ? banners 
    : DEFAULT_BANNERS;

  // Ensure at least 3 slides for Swiper loop mode to work reliably without getting stuck
  const slides = baseSlides.length === 1
    ? [baseSlides[0], baseSlides[0], baseSlides[0]]
    : baseSlides.length === 2
      ? [baseSlides[0], baseSlides[1], baseSlides[0], baseSlides[1]]
      : baseSlides;

  return (
    <section className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[480px] mt-20 md:mt-24 select-none">
      <div className="relative w-full h-full overflow-hidden bg-brand-950/20">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          speed={600}
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
          navigation={true}
          loop={slides.length > 1}
          className="w-full h-full absolute inset-0"
        >
          {slides.map((slide, idx) => {
            const isSplit = slide.image_url.includes(',');
            const [leftImg, rightImg] = isSplit ? slide.image_url.split(',') : [slide.image_url, ''];

            return (
              <SwiperSlide key={`${slide.id || 'banner'}-${idx}`} className="relative w-full h-full flex items-center justify-center">
                <Link
                  href={slide.href || '#'}
                  className="absolute inset-0 block w-full h-full z-10 group overflow-hidden bg-brand-950/50"
                >
                  {isSplit ? (
                    <div className="grid grid-cols-2 w-full h-full">
                      <div className="relative w-full h-full overflow-hidden border-r border-white/5">
                        <img
                          src={leftImg}
                          alt="Left Banner"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      </div>
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={rightImg}
                          alt="Right Banner"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={slide.image_url}
                        alt="Promotional Banner"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      {/* Ambient Radial Background Glow */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-all duration-1000 z-20"
                        style={{
                          background: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.05) 0%, transparent 80%)'
                        }}
                      />
                    </>
                  )}
                  {/* Subtle dark overlay */}
                  <div className="absolute inset-0 bg-brand-950/15 group-hover:bg-brand-950/5 transition-colors duration-300 z-15" />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
