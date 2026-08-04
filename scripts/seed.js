const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to load env variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local file not found. Create it in the root directory with Supabase keys first.');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/^"|"/g, '');
      }
      env[key] = value.trim();
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or keys missing in .env.local.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = [
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
  }
];

const PRODUCTS = [
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
    is_promo: true,
    promo_price: 12.00,
    count_in_stock: 50
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
    is_promo: false,
    count_in_stock: 100
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
    is_promo: true,
    promo_price: 99.99,
    count_in_stock: 18
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
    is_promo: false,
    count_in_stock: 25
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
    is_promo: true,
    promo_price: 189.99,
    count_in_stock: 10
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
    is_promo: false,
    count_in_stock: 12
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
    is_promo: false,
    count_in_stock: 15
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
    is_promo: true,
    promo_price: 44.99,
    count_in_stock: 22
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
    is_promo: false,
    count_in_stock: 8
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
    is_promo: true,
    promo_price: 24.99,
    count_in_stock: 35
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
    is_promo: false,
    count_in_stock: 40
  }
];

async function seed() {
  console.log('Seeding Supabase database...');

  // 1. Seed Categories
  console.log('Inserting categories...');
  const { error: catError } = await supabase.from('categories').upsert(CATEGORIES);
  if (catError) {
    console.error('Error inserting categories:', catError);
    process.exit(1);
  }
  console.log('Categories inserted successfully.');

  // 2. Seed Products
  console.log('Inserting products...');
  const { error: prodError } = await supabase.from('products').upsert(PRODUCTS);
  if (prodError) {
    console.error('Error inserting products:', prodError);
    process.exit(1);
  }
  console.log('Products inserted successfully.');
  console.log('Seeding completed successfully!');
}

seed();
