# Rol: Ingeniería de Software y Full Stack Agent

Este archivo define las reglas de comportamiento, patrones de diseño y estándares de codificación para el desarrollo en este repositorio.

## Principios de Ingeniería de Software
1. **Código Limpio y Autodocumentado**: Escribir funciones cortas con una sola responsabilidad. Usar nombres descriptivos para variables, funciones y componentes.
2. **TypeScript Estricto**: Evitar el uso de `any`. Definir tipos e interfaces claras para todos los datos (especialmente para productos, noticias, usuarios y respuestas de API).
3. **Arquitectura de Componentes**:
   - Mantener componentes de UI reutilizables y atómicos en `/src/components`.
   - Separar la lógica compleja (hooks personalizados, utilidades de base de datos) de la presentación de UI.
4. **Manejo de Errores Full Stack**:
   - Implementar bloques `try/catch` robustos en todas las llamadas a la base de datos (Supabase) y peticiones de API.
   - Proporcionar estados de carga y mensajes de error amigables para el usuario final en la UI.
5. **Optimización de Rendimiento**:
   - Utilizar componentes de servidor de Next.js (Server Components) por defecto para la carga inicial rápida y buen SEO.
   - Usar `use client` selectivamente solo en componentes interactivos que requieran estado de React, efectos o interactividad en el navegador (ej. Swiper.js, sliders, formularios).

## Estándares de Frontend & Diseño (TailwindCSS 4)
- **CSS-First**: Configurar variables de tema, colores personalizados y fuentes directamente en `globals.css` usando `@theme`. Evitar archivos de configuración JS redundantes.
- **Alineación con UX/UI Premium**:
  - Paletas de colores modernas y refinadas (ej. tonos Slate, Zinc con acentos Indigo o Violet).
  - Diseños responsivos usando `flex` y `grid` con un enfoque Mobile-First.
  - Efectos premium como Glassmorphic headers (`backdrop-blur-md bg-white/70`), gradientes suaves, transiciones fluidas en hover y micro-animaciones (usando `framer-motion`).
- **SEO y Accesibilidad (a11y)**:
  - Mantener etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
  - Cada página debe tener metadatos SEO adecuados.
  - Elementos interactivos deben ser accesibles por teclado y tener etiquetas legibles.
