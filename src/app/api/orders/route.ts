import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

const MOCK_ORDERS = [
  {
    id: 'ord_9f8e7d6c5b',
    created_at: new Date().toISOString(),
    client_name: 'Juan Pérez',
    whatsapp_number: '987654321',
    address: 'Av. Larco 123, Miraflores',
    total: 85.00,
    status: 'pendiente',
    items: [
      { name: 'Hielo Gourmet Esferas 6x', quantity: 2, price: 15.00 },
      { name: 'Pisco Portón Mosto Verde', quantity: 1, price: 55.00 }
    ]
  },
  {
    id: 'ord_1a2b3c4d5e',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    client_name: 'María Rodriguez',
    whatsapp_number: '912345678',
    address: 'Calle Las Flores 456, San Isidro',
    total: 120.00,
    status: 'pagado',
    items: [
      { name: 'Whisky Johnnie Walker Black Label', quantity: 1, price: 120.00 }
    ]
  }
];

export async function POST(req: Request) {
  try {
    const { clientName, clientAddress, items, total } = await req.json();

    if (!clientName || !clientAddress || !items || items.length === 0 || total <= 0) {
      return NextResponse.json({ error: 'Datos de pedido inválidos' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({
        success: true,
        orderId: 'mock_' + Math.random().toString(36).substr(2, 9),
        isMock: true
      });
    }

    // 1. Check stock for each item in inventory
    for (const item of items) {
      const { data: invData, error: invError } = await supabase
        .from('inventory')
        .select('stock')
        .eq('product_id', item.id);

      if (invError) throw invError;

      const currentStock = invData && invData.length > 0 ? Number(invData[0].stock || 0) : 0;
      if (currentStock < item.quantity) {
        return NextResponse.json({
          error: `Stock insuficiente para el producto: ${item.name}. Disponible: ${currentStock} unidades.`
        }, { status: 400 });
      }
    }

    // 2. Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        client_name: clientName,
        address: clientAddress,
        whatsapp_number: '',
        items: items,
        total: Number(total),
        status: 'pendiente'
      }])
      .select()
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // 3. For each item, register a stock movement of type 'salida' to block/reserve stock
    const { data: whRows } = await supabase
      .from('warehouses')
      .select('id')
      .limit(1);

    const warehouseId = whRows && whRows.length > 0 ? whRows[0].id : null;

    if (warehouseId) {
      for (const item of items) {
        const { error: movErr } = await supabase
          .from('stock_movements')
          .insert([{
            product_id: item.id,
            warehouse_id: warehouseId,
            type: 'salida',
            quantity: Number(item.quantity),
            reason: `Reserva temporal pedido: ${orderId.slice(0, 8).toUpperCase()}`
          }]);

        if (movErr) {
          console.error(`Error logging checkout movement for product ${item.id}:`, movErr);
        }
      }
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Fallo al procesar pedido: ' + error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: true, isMock: true });
    }

    // 1. Fetch current order to check previous status and items
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError) throw fetchError;
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const oldStatus = order.status;

    if (oldStatus === 'cancelado') {
      return NextResponse.json({ error: 'El pedido ya está cancelado y no puede ser modificado' }, { status: 400 });
    }

    // 2. Update status in DB
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // 3. If new status is 'cancelado', restore stock!
    if (status === 'cancelado') {
      const { data: whRows } = await supabase
        .from('warehouses')
        .select('id')
        .limit(1);

      const warehouseId = whRows && whRows.length > 0 ? whRows[0].id : null;

      if (warehouseId) {
        const items = order.items || [];
        for (const item of items) {
          const { error: movErr } = await supabase
            .from('stock_movements')
            .insert([{
              product_id: item.id,
              warehouse_id: warehouseId,
              type: 'entrada',
              quantity: Number(item.quantity),
              reason: `Devolución por cancelación pedido: ${orderId.slice(0, 8).toUpperCase()}`
            }]);

          if (movErr) {
            console.error(`Error logging cancellation movement for product ${item.id}:`, movErr);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update Order API error:', error);
    return NextResponse.json({ error: 'Fallo al actualizar pedido: ' + error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!supabase) {
      if (id) {
        const order = MOCK_ORDERS.find(o => o.id === id);
        if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
        return NextResponse.json(order);
      }
      return NextResponse.json(MOCK_ORDERS);
    }

    if (id) {
      try {
        const { data: order, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return NextResponse.json(order);
      } catch (dbError) {
        console.warn('Fallo al obtener pedido de Supabase, usando fallback mock:', dbError);
        const order = MOCK_ORDERS.find(o => o.id === id);
        if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
        return NextResponse.json(order);
      }
    } else {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(orders);
      } catch (dbError) {
        console.warn('Fallo al obtener pedidos de Supabase, usando fallback mock:', dbError);
        return NextResponse.json(MOCK_ORDERS);
      }
    }
  } catch (error: any) {
    console.error('Get Orders API error:', error);
    return NextResponse.json({ error: 'Fallo al obtener pedidos: ' + error.message }, { status: 500 });
  }
}
