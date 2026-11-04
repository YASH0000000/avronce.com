import { NextResponse } from 'next/server';
import { getDbProducts, updateDbStock } from '@/lib/db';

export async function GET() {
  try {
    const products = await getDbProducts();
    const lowStock = products.filter((p) => (p.stock || 0) < 15);
    const outOfStock = products.filter((p) => (p.stock || 0) === 0);

    return NextResponse.json({
      success: true,
      totalCount: products.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, stock } = body;

    if (!id || stock === undefined) {
      return NextResponse.json({ success: false, error: 'Product id and stock are required' }, { status: 400 });
    }

    const updated = await updateDbStock(id, Number(stock));
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
