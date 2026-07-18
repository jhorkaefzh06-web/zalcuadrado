export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  brand: string;
  features: string[];
  isPromo: boolean;
  promoPrice?: number;
  countInStock: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  details: string[];
  icon: string; // Lucide icon name
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  avatar: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "tecnologia",
    name: "Tecnología",
    description: "Dispositivos de última generación y gadgets inteligentes.",
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "hogar",
    name: "Hogar y Decoración",
    description: "Muebles modernos y decoración minimalista.",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "deportes",
    name: "Deportes y Bienestar",
    description: "Equipamiento de alto rendimiento para entrenar en casa o fuera.",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "oficina",
    name: "Oficina y Productividad",
    description: "Optimiza tu espacio de trabajo remoto con estilo.",
    icon: "Briefcase",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "audio",
    name: "Audio y Sonido",
    description: "Auriculares premium y altavoces inalámbricos de alta fidelidad.",
    icon: "Headphones",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Auriculares Inalámbricos Pro ANC",
    price: 189.99,
    description: "Auriculares inalámbricos con cancelación activa de ruido premium, 30 horas de autonomía y sonido envolvente de alta resolución.",
    category: "audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    brand: "SonicWave",
    features: ["Cancelación de Ruido Activa", "Batería de 30h", "Bluetooth 5.2", "Audio de Alta Resolución"],
    isPromo: true,
    promoPrice: 149.99,
    countInStock: 25
  },
  {
    id: "p2",
    name: "Reloj Inteligente Horizon Fit",
    price: 249.99,
    description: "Monitor de ritmo cardíaco, GPS integrado, pantalla AMOLED de 1.4 pulgadas y sumergible hasta 50 metros.",
    category: "tecnologia",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    brand: "Horizon",
    features: ["GPS Integrado", "Pantalla AMOLED", "Sensor SpO2", "Resistente al agua 50m"],
    isPromo: false,
    countInStock: 15
  },
  {
    id: "p3",
    name: "Teclado Mecánico Compacto RGB",
    price: 129.99,
    description: "Teclado mecánico en formato 65% con switches brown silenciosos, retroiluminación RGB personalizada y conexión triple (cable/wireless/bluetooth).",
    category: "oficina",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    brand: "KeyForge",
    features: ["Switches Mecánicos Brown", "Diseño Compacto 65%", "Conexión Triple", "Iluminación RGB"],
    isPromo: true,
    promoPrice: 99.99,
    countInStock: 8
  },
  {
    id: "p4",
    name: "Silla de Oficina Ergonómica Aura",
    price: 349.99,
    description: "Silla ergonómica de malla transpirable, soporte lumbar dinámico 3D y reposabrazos ajustables para un máximo confort diario.",
    category: "oficina",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    brand: "ErgoComfort",
    features: ["Soporte Lumbar 3D", "Malla Premium Transpirable", "Base de Aluminio", "Reposacabezas Ajustable"],
    isPromo: false,
    countInStock: 12
  },
  {
    id: "p5",
    name: "Mesa de Escritorio Ajustable en Altura",
    price: 499.99,
    description: "Escritorio elevable eléctrico con doble motor, 4 perfiles de memoria y tablero de madera natural ecológica de 140x70cm.",
    category: "oficina",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    brand: "ErgoComfort",
    features: ["Doble Motor Silencioso", "4 Memorias de Altura", "Tablero de Madera Ecológica", "Capacidad 100kg"],
    isPromo: false,
    countInStock: 5
  },
  {
    id: "p6",
    name: "Lámpara de Escritorio Inteligente LED",
    price: 79.99,
    description: "Lámpara LED con control de temperatura de color, ajuste de brillo automático basado en la luz ambiental y puerto de carga USB.",
    category: "hogar",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    brand: "Lumina",
    features: ["Ajuste de Brillo Automático", "5 Modos de Temperatura", "Puerto de Carga USB", "Diseño Flexible"],
    isPromo: true,
    promoPrice: 59.99,
    countInStock: 30
  },
  {
    id: "p7",
    name: "Maceta Geométrica Minimalista (Set de 3)",
    price: 45.00,
    description: "Set de 3 macetas de cerámica esmaltada con base de bambú natural. Perfectas para suculentas y plantas pequeñas de interior.",
    category: "hogar",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600&auto=format&fit=crop",
    rating: 4.4,
    brand: "Lumina",
    features: ["Cerámica de Alta Calidad", "Plato de Bambú Natural", "Agujero de Drenaje", "Estilo Nórdico"],
    isPromo: false,
    countInStock: 40
  },
  {
    id: "p8",
    name: "Mochila Impermeable Urban Travel",
    price: 95.00,
    description: "Mochila de viaje urbana impermeable de 25L con compartimiento acolchado para portátil de hasta 16 pulgadas y bolsillos de acceso rápido ocultos.",
    category: "deportes",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    brand: "Vanguard",
    features: ["Material Impermeable IPX4", "Portátil 16 pulgadas", "Capacidad de 25 Litros", "Espaldar Acolchado"],
    isPromo: true,
    promoPrice: 75.00,
    countInStock: 18
  },
  {
    id: "p9",
    name: "Botella Térmica de Acero Inoxidable",
    price: 35.00,
    description: "Botella de doble pared aislada al vacío que mantiene el frío por 24 horas y el calor por 12 horas. Libre de BPA y ecológica.",
    category: "deportes",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    brand: "Vanguard",
    features: ["Aislamiento al Vacío", "Acero Inoxidable 18/8", "Libre de BPA", "Mantiene frío 24h/calor 12h"],
    isPromo: false,
    countInStock: 50
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Laura Martínez",
    role: "Diseñadora UX/UI Freelance",
    feedback: "La silla de oficina Aura cambió mi vida laboral. Ya no tengo dolores de espalda después de jornadas de 8 horas. El servicio al cliente fue excepcional y la entrega superó las expectativas.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "t2",
    name: "Carlos Mendoza",
    role: "Líder Técnico de Software",
    feedback: "Compré el teclado mecánico y los auriculares Pro ANC. El sonido de los auriculares es increíblemente nítido, ideal para concentrarse en la oficina abierta. Altamente recomendable.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "t3",
    name: "Ana Sofía Ramos",
    role: "Emprendedora",
    feedback: "Excelente relación calidad-precio. La mesa de altura ajustable funciona de maravilla y el motor es súper silencioso. Un antes y un después en mi oficina en casa.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  }
];

export const SERVICES: Service[] = [
  {
    id: "s1",
    name: "Asesoría en Ergonomía",
    description: "Ayudamos a configurar tu espacio de trabajo de manera ergonómica para optimizar tu salud, confort y productividad diaria.",
    details: [
      "Evaluación personalizada de postura e iluminación.",
      "Recomendación detallada de equipos (mesas, sillas, accesorios).",
      "Guías de pausa activa y estiramientos corporales.",
      "Seguimiento posconfiguración en línea."
    ],
    icon: "ShieldAlert",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "s2",
    name: "Instalación y Configuración Smart Home",
    description: "Configuración profesional de tu red y dispositivos del hogar inteligente: luces, asistentes, seguridad y sensores.",
    details: [
      "Estudio de cobertura Wi-Fi y optimización de routers.",
      "Configuración de asistentes virtuales (Alexa, Google Home).",
      "Automatización de iluminación inteligente y eficiencia energética.",
      "Capacitación básica del sistema en el sitio."
    ],
    icon: "Wifi",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "s3",
    name: "Soporte Técnico Especializado",
    description: "Mantenimiento preventivo, optimización de sistemas operativos y resolución de problemas de hardware y periféricos.",
    details: [
      "Diagnóstico remoto e instalación de software corporativo.",
      "Limpieza física y optimización interna de PCs y laptops.",
      "Configuración avanzada de sonido y periféricos gaming.",
      "Respaldo y migración segura de datos sensibles."
    ],
    icon: "Settings",
    image: "https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=800&auto=format&fit=crop"
  }
];

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "El auge del trabajo híbrido y la importancia de la ergonomía",
    excerpt: "Descubre cómo el diseño de tu espacio de trabajo puede impactar radicalmente en tu rendimiento laboral y bienestar general.",
    content: "En los últimos años, el trabajo remoto e híbrido ha dejado de ser un beneficio ocasional para convertirse en una modalidad estándar. Sin embargo, muchos profesionales siguen trabajando en mesas inadecuadas y sillas de comedor. Este artículo analiza los efectos a largo plazo en la columna vertebral y la productividad, y propone pequeños cambios ergonómicos accesibles para cualquier persona. Desde la altura de la pantalla hasta la posición de las muñecas, detallamos los secretos de un setup saludable.",
    category: "Bienestar",
    date: "12 Jul 2026",
    author: "Dr. Marcos Valdés",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop",
    readTime: "5 min de lectura"
  },
  {
    id: "n2",
    title: "Tendencias tecnológicas 2026: El hogar ultra inteligente",
    excerpt: "Los sensores inteligentes y la automatización integrada de bajo consumo están redefiniendo el significado de confort doméstico.",
    content: "La domótica ha dado un salto gigante en el último año gracias a los avances en la interconectividad nativa y la eficiencia energética. En esta entrega, exploramos cómo los nuevos asistentes de voz coordinan sistemas climatizadores pasivos, cortinas inteligentes de respuesta solar y optimizadores de consumo eléctrico en tiempo real. La tecnología invisible ya no es ciencia ficción, es una inversión en comodidad y sostenibilidad ambiental para tu hogar.",
    category: "Tecnología",
    date: "05 Jul 2026",
    author: "Elena Rostova",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    readTime: "7 min de lectura"
  },
  {
    id: "n3",
    title: "Cómo elegir los auriculares con cancelación de ruido ideales",
    excerpt: "Una guía de compra técnica para entender qué buscar en tus próximos auriculares de cara a concentrarte en el trabajo.",
    content: "No toda la cancelación activa de ruido (ANC) es igual. Algunos sistemas son ideales para aislar sonidos continuos de baja frecuencia como motores, mientras que otros atenúan conversaciones humanas. Esta guía explica el funcionamiento técnico de los micrófonos de retroalimentación en auriculares, las ventajas de los códecs de transmisión de audio Bluetooth de alta tasa de transferencia (LDAC, aptX Adaptive) y cómo el ajuste anatómico influye drásticamente en el aislamiento pasivo.",
    category: "Audio",
    date: "28 Jun 2026",
    author: "Carlos Mendoza",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
    readTime: "4 min de lectura"
  }
];
