import { createClient } from '@supabase/supabase-js';
import { Product, Category } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://efmvcqxmaslouqxvmvqz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbXZjcXhtYXNsb3VxeHZtdnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNDQ0NzUsImV4cCI6MjEwODkyMDQ3NX0.L1NxqMKuhuPcG6dr43BuR_q9R94vGtZ3dnH7zpKddDI';

export const createServerSupabase = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  limit?: number;
  gender?: string;
}): Promise<Product[]> {
  const supabase = createServerSupabase();
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .order('created_at', { ascending: false });

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }

  if (options?.categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.categorySlug)
      .single();
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  if (options?.isFeatured !== undefined) {
    query = query.eq('is_featured', options.isFeatured);
  }

  if (options?.gender && options.gender !== 'all') {
    query = query.or(`gender.eq.${options.gender},gender.eq.unisex`);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    images: (p.images || []).sort((a: any, b: any) => a.display_order - b.display_order),
    variants: (p.variants || []).sort((a: any, b: any) => a.sku.localeCompare(b.sku)),
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    images: (data.images || []).sort((a: any, b: any) => a.display_order - b.display_order),
    variants: (data.variants || []).sort((a: any, b: any) => a.sku.localeCompare(b.sku)),
  };
}

export async function getRelatedProducts(productId: string, categoryId?: string | null, limit = 4): Promise<Product[]> {
  const supabase = createServerSupabase();
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .neq('id', productId)
    .limit(limit);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    images: (p.images || []).sort((a: any, b: any) => a.display_order - b.display_order),
    variants: (p.variants || []).sort((a: any, b: any) => a.sku.localeCompare(b.sku)),
  }));
}
