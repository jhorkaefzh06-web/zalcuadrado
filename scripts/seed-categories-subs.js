const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to load env variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local file not found.');
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
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false
  }
});

// Categories list matching user design
const CATEGORIES = [
  { id: 'licores', name: 'Licores', description: 'Whiskies, Rones, Piscos, Ginebras, Vodkas, Tequilas y complementos.' },
  { id: 'vinos', name: 'Vinos', description: 'Vinos Tintos Gran Reserva, Rosados, Blancos y Sangrías.' },
  { id: 'espumantes', name: 'Espumantes', description: 'Champagnes, Cavas y Espumantes finos.' },
  { id: 'cervezas', name: 'Cervezas', description: 'Cervezas nacionales, importadas y artesanales.' },
  { id: 'cigarros', name: 'Cigarros', description: 'Cigarros y tabacos premium.' },
  { id: 'hielo', name: 'Hielo', description: 'Hielo gourmet cristalino en esferas y cubos purificados.' }
];

// Subcategories list matching user design
const SUBCATEGORIES = [
  // Licores
  { id: 'licor-del-mes', category_id: 'licores', name: 'Licor Del Mes' },
  { id: 'whisky', category_id: 'licores', name: 'Whisky' },
  { id: 'ron', category_id: 'licores', name: 'Ron' },
  { id: 'pisco', category_id: 'licores', name: 'Pisco' },
  { id: 'gin', category_id: 'licores', name: 'Gin' },
  { id: 'vodka', category_id: 'licores', name: 'Vodka' },
  { id: 'tequila', category_id: 'licores', name: 'Tequila' },
  { id: 'licores-de-crema', category_id: 'licores', name: 'Licores De Crema' },
  { id: 'listos-para-tomar', category_id: 'licores', name: 'Listos Para Tomar' },
  { id: 'otros-licores', category_id: 'licores', name: 'Otros Licores' },
  { id: 'complementos-de-licores', category_id: 'licores', name: 'Complementos De Licores' },

  // Vinos
  { id: 'bodega-del-mes', category_id: 'vinos', name: 'Bodega Del Mes' },
  { id: 'alta-gama', category_id: 'vinos', name: 'Alta Gama' },
  { id: 'vino-tinto', category_id: 'vinos', name: 'Vino Tinto' },
  { id: 'vino-rose', category_id: 'vinos', name: 'Vino Rosé' },
  { id: 'vino-blanco', category_id: 'vinos', name: 'Vino Blanco' },
  { id: 'sangria', category_id: 'vinos', name: 'Sangría' },

  // Espumantes
  { id: 'champagne', category_id: 'espumantes', name: 'Champagne' },
  { id: 'cava', category_id: 'espumantes', name: 'Cava' },
  { id: 'otros-espumantes', category_id: 'espumantes', name: 'Otros Espumantes' },

  // Cervezas
  { id: 'cervezas-nacionales', category_id: 'cervezas', name: 'Cervezas Nacionales' },
  { id: 'cervezas-importadas', category_id: 'cervezas', name: 'Cervezas Importadas' },
  { id: 'cervezas-artesanales', category_id: 'cervezas', name: 'Cervezas Artesanales' }
];

// Product remapping rules
const PRODUCT_MAPPINGS = [
  { id: 'p1', category: 'licores', subcategory: 'whisky' },
  { id: 'p2', category: 'espumantes', subcategory: 'champagne' },
  { id: 'p3', category: 'licores', subcategory: 'tequila' },
  { id: 'p4', category: 'vinos', subcategory: 'vino-tinto' },
  { id: 'p5', category: 'licores', subcategory: 'ron' },
  { id: 'p6', category: 'licores', subcategory: 'gin' },
  { id: 'p7', category: 'licores', subcategory: 'whisky' },
  { id: 'p8', category: 'cervezas', subcategory: 'cervezas-artesanales' },
  { id: 'p9', category: 'licores', subcategory: 'licores-de-crema' },
  { id: 'ph1', category: 'hielo', subcategory: null },
  { id: 'ph2', category: 'hielo', subcategory: null }
];

async function seedCategoriesAndSubs() {
  console.log('1. Altering products table to add subcategory column...');
  try {
    const alterQuery = `
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS subcategory TEXT REFERENCES subcategories(id) ON DELETE SET NULL;
    `;
    const { error: alterErr } = await supabase.rpc('execute_sql', { query: alterQuery });
    if (alterErr) throw alterErr;
    console.log('🎉 Column subcategory added/verified successfully!');

    // 2. Insert main categories
    console.log('\n2. Seeding main categories...');
    const { error: catErr } = await supabase
      .from('categories')
      .upsert(CATEGORIES);
    if (catErr) throw catErr;
    console.log('🎉 Categories seeded successfully.');

    // 3. Insert subcategories
    console.log('\n3. Seeding subcategories...');
    const { error: subErr } = await supabase
      .from('subcategories')
      .upsert(SUBCATEGORIES);
    if (subErr) throw subErr;
    console.log('🎉 Subcategories seeded successfully.');

    // 4. Remap products
    console.log('\n4. Remapping products to new categories and subcategories...');
    for (const mapping of PRODUCT_MAPPINGS) {
      console.log(`Mapping product ${mapping.id} to category: ${mapping.category}, subcategory: ${mapping.subcategory || 'None'}...`);
      const { error: updateErr } = await supabase
        .from('products')
        .update({
          category: mapping.category,
          subcategory: mapping.subcategory
        })
        .eq('id', mapping.id);
      
      if (updateErr) {
        console.warn(`⚠️ Failed to map product ${mapping.id}: ${updateErr.message}`);
      }
    }

    console.log('\n🎉 ALL DONE! Database categories, subcategories, and product mappings seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding process failed:', err.message);
    process.exit(1);
  }
}

seedCategoriesAndSubs();
