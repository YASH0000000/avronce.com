import { NextResponse } from 'next/server';
import { getDbCoupons, saveDbCoupon, deleteDbCoupon } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await getDbCoupons();
    return NextResponse.json({ success: true, count: coupons.length, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const saved = await saveDbCoupon(body);
    return NextResponse.json({ success: true, coupon: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Coupon id or code is required' }, { status: 400 });
    }

    const deleted = await deleteDbCoupon(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
