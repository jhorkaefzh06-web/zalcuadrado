import { NextResponse } from 'next/server';
import { fetchAllProducts, saveProductToStore, deleteProductFromStore } from '@/lib/productsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await fetchAllProducts();
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (name, price, category)' }, { status: 400 });
    }
    const saved = await saveProductToStore(body);
    return NextResponse.json({ success: true, product: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Falta el ID del producto' }, { status: 400 });
    }
    await deleteProductFromStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
