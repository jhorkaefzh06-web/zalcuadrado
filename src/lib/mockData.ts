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
    id: "hielos",
    name: "Hielos & Hielo Gourmet",
    description: "Hielo cristalino en esferas, cubos macizos, escamas y hielo seco para cócteles.",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1517559132301-7e137c887960?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "bebidas",
    name: "Bebidas & Licores",
    description: "Whiskies, Vinos reservas, Rones, Tequilas, Ginebras y Cervezas de especialidad.",
    icon: "Wine",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "whiskies",
    name: "Whiskies & Bourbon",
    description: "Single Malts escoceses, Bourbons añejados y ediciones limitadas.",
    icon: "Flame",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "vinos",
    name: "Vinos & Champagnes",
    description: "Tintos Gran Reserva, Blancos jóvenes, Cavas y Champagnes franceses.",
    icon: "Wine",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "rones-tequilas",
    name: "Rones & Tequilas",
    description: "Rones Solera, Tequilas 100% Agave Reposados y Mezcales artesanales.",
    icon: "GlassWater",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "ginebras",
    name: "Ginebras & Gin",
    description: "Ginebras premium infusionadas con botánicos exóticos de todo el mundo.",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "cervezas-licores",
    name: "Cervezas & Licores Finos",
    description: "Cervezas artesanales IPA/Stout, aperitivos digestivos y cremas.",
    icon: "Beer",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800&auto=format&fit=crop"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "ph1",
    name: "Hielo Gourmet Esferas de Cristal (Pack x12)",
    price: 15.00,
    description: "Esferas de hielo cristalino de fusión ultra lenta (60mm), ideales para Whiskies Single Malt y coctelería de autor.",
    category: "hielos",
    image: "https://images.unsplash.com/photo-1517559132301-7e137c887960?q=80&w=600&auto=format&fit=crop",
    rating: 5.0,
    brand: "Z² Ice",
    features: ["Fusión Ultra Lenta", "Agua Filtrada por Ósmosis", "Cero Burbujas / Cristalino", "Set de 12 Unidades"],
    isPromo: true,
    promoPrice: 12.00,
    countInStock: 50
  },
  {
    id: "ph2",
    name: "Hielo Purificado en Cubos Macizos (Bolsa 5 Kg)",
    price: 8.00,
    description: "Cubos de hielo macizo purificado sin sabor ni olor. El complemento indispensable para tus reuniones y fiestas.",
    category: "hielos",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4e?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    brand: "Z² Ice",
    features: ["Bolsa de 5 Kilos", "Triple Filtración UV", "Cubos Macizos", "Empaque Térmico Sellado"],
    isPromo: false,
    countInStock: 100
  },
  {
    id: "p1",
    name: "Whisky The Macallan 12 Años Double Cask",
    price: 119.99,
    description: "Un equilibrado Single Malt elaborado en barricas de roble americano y europeo sazonadas con jerez. Notas de miel, cítricos y roble equilibrado.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    brand: "The Macallan",
    features: ["12 Años de Añejamiento", "Single Malt Escocés", "40% Vol. Alcohol", "Estuche de Colección"],
    isPromo: true,
    promoPrice: 99.99,
    countInStock: 18
  },
  {
    id: "p2",
    name: "Champagne Moët & Chandon Brut Impérial",
    price: 79.99,
    description: "El icónico Champagne francés caracterizado por su brillante frutalidad, un paladar seductor y una madurez elegante.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    brand: "Moët & Chandon",
    features: ["Denominación Champagne AOC", "Pinot Noir, Chardonnay", "12% Vol. Alcohol", "Servir a 8°C - 10°C"],
    isPromo: false,
    countInStock: 25
  },
  {
    id: "p3",
    name: "Tequila Don Julio 1942 Añejo Extra",
    price: 220.00,
    description: "Tequila artesanal producido en pequeños lotes, añejado durante un mínimo de dos años y medio en barricas de roble blanco estadounidense.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop",
    rating: 5.0,
    brand: "Don Julio",
    features: ["100% Agave Azul", "2.5 Años en Barrica", "Edición Icono Luxury", "Notas de Vainilla y Caramelo"],
    isPromo: true,
    promoPrice: 189.99,
    countInStock: 10
  },
  {
    id: "p4",
    name: "Vino Tinto Vega Sicilia Valbuena 5º Año",
    price: 195.00,
    description: "Uno de los tintos emblemáticos de Ribera del Duero. Expresión pura de la variedad Tinto Fino con una crianza impecable de 5 años.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    brand: "Vega Sicilia",
    features: ["DO Ribera del Duero", "Tinto Fino / Cabernet Sauvignon", "5 Años Crianza", "Gran Potencial de Guarda"],
    isPromo: false,
    countInStock: 12
  },
  {
    id: "p5",
    name: "Ron Zacapa Centenario XO Solera Gran Reserva",
    price: 135.00,
    description: "Ron de alta montaña guatemalteca elaborado mediante el sistema Solera y terminado en barricas de coñac francés.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    brand: "Zacapa",
    features: ["Añejamiento 6 a 25 Años", "Añejado a 2300m de Altura", "Acabado en Barrica de Coñac", "Notas de Especias y Chocolate"],
    isPromo: false,
    countInStock: 15
  },
  {
    id: "p6",
    name: "Gin Hendrick's Orbium Botanical Edition",
    price: 54.99,
    description: "Una reinterpretación del clásico Hendrick's con infusión adicional de quinina, ajenjo y flor de loto azul para un perfil complejo e inigualable.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    brand: "Hendrick's",
    features: ["Infusión de Pepino y Rosa", "Quinina y Ajenjo", "Destilado en Escocia", "Botella Estilo Apoteca"],
    isPromo: true,
    promoPrice: 44.99,
    countInStock: 22
  },
  {
    id: "p7",
    name: "Whisky Johnnie Walker Blue Label",
    price: 249.99,
    description: "Una obra maestra inigualable. Una combinación extraordinaria de los whiskies más raros y excepcionales de toda Escocia.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    brand: "Johnnie Walker",
    features: ["1 de cada 10,000 barricas elegida", "Suavidad Terciopelada", "Botella Numerada", "Presentación de Regalo VIP"],
    isPromo: false,
    countInStock: 8
  },
  {
    id: "p8",
    name: "Pack Cervezas Artesanales IPA & Imperial Stout (Set 6)",
    price: 29.99,
    description: "Selección especial de microcervecerías galardonadas: 3 Double Dry-Hopped IPAs y 3 Imperial Russian Stouts añejadas en barrica.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    brand: "Craft Masters",
    features: ["Cerveza 100% Artesanal", "Sin Filtrar ni Pasteurizar", "Lúpulos Frescos de Origen", "Pack Regalo de Colección"],
    isPromo: true,
    promoPrice: 24.99,
    countInStock: 35
  },
  {
    id: "p9",
    name: "Licor Baileys Irish Cream Original (1L)",
    price: 28.00,
    description: "La perfecta unión del mejor whisky irlandés con crema de leche fresca, cacao puro y vainilla. El digestivo favorito en todo el mundo.",
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1517559132301-7e137c887960?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    brand: "Baileys",
    features: ["Whisky Irlandés Auténtico", "Crema de Leche Natural", "Ideal con Hielo o en Café", "Contenido 1000ml"],
    isPromo: false,
    countInStock: 40
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Fernando Ruiz",
    role: "Sommelier & Coleccionista",
    feedback: "Impresionante catálogo de whiskies y vinos reserva. Compré varias botellas exclusivas y bolsas de hielo gourmet; la presentación y temperatura fueron impecables.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "t2",
    name: "Mariana Alarcón",
    role: "Organizadora de Eventos",
    feedback: "El servicio de Hielos & Bebidas Z² salvó la fiesta de nuestra empresa. Nos trajeron el hielo gourmet en esferas, champagne y las cervezas en menos de 35 minutos.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "t3",
    name: "Roberto Gaxiola",
    role: "Cliente VIP",
    feedback: "Excelente atención de delivery 24/7. Las bebidas frías y el hielo purificado llegaron justo a tiempo para nuestra reunión de fin de semana.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  }
];

export const SERVICES: Service[] = [
  {
    id: "s1",
    name: "Delivery Express 24/7 de Hielos & Bebidas",
    description: "Entregamos hielos gourmet y tus botellas favoritas a la temperatura perfecta para servir en tu puerta en menos de 45 minutos.",
    details: [
      "Envío en empaques térmicos especializados.",
      "Garantía de hielo cristalino y bebidas heladas.",
      "Seguimiento en tiempo real del repartidor.",
      "Atención nocturna todos los días."
    ],
    icon: "Truck",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "s2",
    name: "Sommelier Privado & Catas a Domicilio",
    description: "Vive una cata guiada por sommeliers profesionales en tu hogar o empresa, degustando seleccionados whiskies, vinos reservas o ginebras finas.",
    details: [
      "Catas personalizadas temáticas (Francia, Escocia, México).",
      "Maridaje con carnes, quesos maduros y chocolates finos.",
      "Incluye cristalería técnica y material de cata.",
      "Sesiones interactivas para grupos pequeños y grandes."
    ],
    icon: "GlassWater",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "s3",
    name: "Regalos Corporativos & Packs VIP",
    description: "Impresiona a tus clientes, ejecutivos o seres queridos con cajas de madera de lujo grabadas, botellas de edición limitada y hielos cristalinos.",
    details: [
      "Personalización de estuches de madera con tu marca o nombre.",
      "Incluye accesorios de acero inoxidable y copas de cristal.",
      "Notas de agradecimiento escritas a mano.",
      "Envíos masivos coordinados a múltiples direcciones."
    ],
    icon: "Gift",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "s4",
    name: "Catering de Bebidas para Bodas & Eventos",
    description: "Planificación completa de la barra de tu boda o fiesta. Suministro de bebidas, barras de trago y servicio de hielo continuo.",
    details: [
      "Suministro a consignación (devuelves lo que no consumas).",
      "Bartenders profesionales y mixólogos expertos.",
      "Suministro de hielos gourmet en esferas y cubos.",
      "Precios especiales por volumen al por mayor."
    ],
    icon: "PartyPopper",
    image: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=800&auto=format&fit=crop"
  }
];

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "El secreto del Hielo Gourmet: Por qué la pureza y fusión lenta cambian tu trago",
    excerpt: "Descubre por qué una esfera de hielo cristalino sin aire evita aguar tu whisky o cóctel favorito.",
    content: "El hielo no es simplemente agua congelada; es el ingrediente clave en el 90% de los cócteles. El hielo gourmet elaborado mediante congelación direccional elimina todo el aire atrapado y las sales minerales, logrando una densidad perfecta que se derrite hasta cuatro veces más lento que el hielo común de nevera. Aprende cómo mantener las notas originales de tu Single Malt o Gin Tonic sin aguar la preparación.",
    category: "Hielos & Mixología",
    date: "19 Jul 2026",
    author: "Z² Ice Lab",
    image: "https://images.unsplash.com/photo-1517559132301-7e137c887960?q=80&w=800&auto=format&fit=crop",
    readTime: "4 min de lectura"
  },
  {
    id: "n2",
    title: "Guía de Maridaje: Cómo elegir el vino perfecto para cada ocasión",
    excerpt: "Aprende las reglas de oro para combinar vinos tintos, blancos y espumantes con carnes, mariscos y postres.",
    content: "El maridaje de vinos y gastronomía es un arte accesible para todos. En este artículo, nuestros sommeliers desglosan las combinaciones clásicas e innovadoras: desde la acidez de un Sauvignon Blanc acompañando mariscos frescos, hasta la estructura tánica de un Cabernet Sauvignon maduro junto a cortes de carne a la parrilla.",
    category: "Cultura del Vino",
    date: "18 Jul 2026",
    author: "Jean-Luc Moreau (Sommelier)",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    readTime: "5 min de lectura"
  },
  {
    id: "n3",
    title: "El arte del Whisky Single Malt: Añejamiento en barricas de Jerez",
    excerpt: "Descubre cómo las barricas de roble europeo sazonadas con vino de Jerez aportan las notas de miel y especias al whisky.",
    content: "Más del 60% del sabor de un whisky proviene de la madera durante su maduración. Exploramos el fascinante proceso artesanal en las destilerías de las Highlands escocesas.",
    category: "Whiskies",
    date: "10 Jul 2026",
    author: "Douglas MacGregor",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop",
    readTime: "6 min de lectura"
  }
];
