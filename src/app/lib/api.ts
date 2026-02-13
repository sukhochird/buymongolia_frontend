/**
 * Backend API client — buymongolia_backend (Django) руу холбогдоно.
 * NEXT_PUBLIC_API_URL тохируулах: жишээ нь http://localhost:8000
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchApi<T>(path: string, params?: Record<string, string | boolean | number | undefined>): Promise<T> {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json();
}

async function postApi<T>(path: string, body: object): Promise<T> {
  const res = await fetch(new URL(path, API_BASE).toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `API ${path}: ${res.status}`);
  }
  return res.json();
}

// ——— Types (backend-тай таарна) ———

export interface ApiSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  button: string;
  /** Гаднах холбоос (товч дарахад нээгдэх) */
  link?: string;
  theme: string;
  sort_order: number;
  created_at: string | null;
}

export interface ApiBanner {
  id: number;
  image: string;
  alt: string;
  link: string;
  sort_order: number;
  created_at: string | null;
}

export interface ApiOccasion {
  id: number;
  slug: string;
  title: string;
  image: string;
  subcategories: string;
  sort_order: number;
  created_at: string | null;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  subcategories: ApiCategory[];
}

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  discount: number | null;
  is_pre_order: boolean;
  original_price: number | null;
  old_price: number | null;
  description: string;
  sku: string;
  category: string;
  availability: string;
  supplier: string;
  details: Record<string, string> | null;
  images: string[];
  featured: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

// ——— API дуудлагууд ———

export async function getHeroSlides(active = true): Promise<ApiSlide[]> {
  const data = await fetchApi<{ slides: ApiSlide[] }>('/api/hero-slides/', { active: active ? '1' : undefined });
  return data.slides;
}

export async function getHeroBanners(active = true): Promise<ApiBanner[]> {
  const data = await fetchApi<{ banners: ApiBanner[] }>('/api/hero-banners/', { active: active ? '1' : undefined });
  return data.banners;
}

export async function getOccasions(active = true): Promise<ApiOccasion[]> {
  const data = await fetchApi<{ occasions: ApiOccasion[] }>('/api/occasions/', { active: active ? '1' : undefined });
  return data.occasions;
}

export async function getCategories(): Promise<ApiCategory[]> {
  const data = await fetchApi<{ categories: ApiCategory[] }>('/api/categories/');
  return data.categories;
}

// ——— Header menu (admin-аас удирдагддаг цэс) ———

export type HeaderMenuLinkType = 'external' | 'internal' | 'fragment';

export interface ApiHeaderMenuItem {
  id: number;
  label: string;
  link_type: HeaderMenuLinkType;
  href: string;
  children: ApiHeaderMenuItem[];
}

export async function getHeaderMenu(): Promise<ApiHeaderMenuItem[]> {
  const data = await fetchApi<{ items: ApiHeaderMenuItem[] }>('/api/header-menu/');
  return data.items ?? [];
}

export interface GetProductsParams {
  featured?: boolean;
  preorder?: boolean;
  /** Онцлох бүтээгдэхүүнийг хасах (сүүлийн нэмэгдсэн хэсэгт) */
  exclude_featured?: boolean;
  /** Захиалгаар бүтээгдэхүүнийг хасах (сүүлийн нэмэгдсэн хэсэгт) */
  exclude_preorder?: boolean;
  /** Эрэмбэ: recent = сүүлийн нэмэгдсэн (created_at) */
  ordering?: 'recent';
  /** Ангилал — Category slug */
  category?: string;
  /** Баяр ёслол — Occasion slug */
  occasion?: string;
  /** Хуудас (1-based) */
  page?: number;
  /** Хуудас бүрт хэдэн бүтээгдэхүүн (default 12) */
  page_size?: number;
}

export interface GetProductsResponse {
  products: ApiProduct[];
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

export async function getProducts(params?: GetProductsParams): Promise<GetProductsResponse> {
  const q: Record<string, string> = {};
  if (params?.featured) q.featured = '1';
  if (params?.preorder) q.preorder = '1';
  if (params?.exclude_featured) q.exclude_featured = '1';
  if (params?.exclude_preorder) q.exclude_preorder = '1';
  if (params?.ordering === 'recent') q.ordering = 'recent';
  if (params?.category) q.category = params.category;
  if (params?.occasion) q.occasion = params.occasion;
  if (params?.page != null) q.page = String(params.page);
  if (params?.page_size != null) q.page_size = String(params.page_size);
  return fetchApi<GetProductsResponse>('/api/products/', q);
}

export async function getProduct(id: number): Promise<ApiProduct> {
  return fetchApi<ApiProduct>(`/api/products/${id}/`);
}

export async function getFeaturedProducts(): Promise<ApiProduct[]> {
  const res = await getProducts({ featured: true });
  return res.products;
}

export async function getPreorderProducts(): Promise<ApiProduct[]> {
  const res = await getProducts({ preorder: true, page_size: 48 });
  return res.products;
}

// ——— Orders + QPay ———

export interface CreateOrderItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_method: 'city' | 'countryside';
  delivery_address?: string;
  items: CreateOrderItem[];
  promo_code?: string;
}

// ——— Promo code ———

export interface ValidatePromoResponse {
  valid: boolean;
  code?: string;
  discount_type?: 'percent' | 'fixed';
  discount_value?: number;
  discount_amount?: number;
  error?: string;
}

export async function validatePromoCode(
  code: string,
  subtotal: number
): Promise<ValidatePromoResponse> {
  const res = await fetch(
    `${API_BASE}/api/promo/validate/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim(), subtotal }),
      cache: 'no-store',
    }
  );
  const data = await res.json();
  if (!res.ok) return { valid: false, error: (data as { error?: string }).error || 'Алдаа гарлаа.' };
  return data as ValidatePromoResponse;
}

export interface QPayUrl {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface CreateOrderResponse {
  order_id: number;
  order_number: string;
  total: number;
  status: string;
  qpay: {
    invoice_id: string;
    qr_code: string;
    qr_image: string;
    urls: QPayUrl[];
    invoice_status: string;
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  return postApi<CreateOrderResponse>('/api/orders/', payload);
}

export interface ApiOrderDetail {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_method: string;
  delivery_address: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  qpay_invoice_id: string;
  qpay_invoice_status: string;
  items: { id: number; product_name: string; price: number; quantity: number; line_total: number; product_image: string }[];
  created_at: string | null;
  updated_at: string | null;
}

export async function getOrder(id: number): Promise<ApiOrderDetail> {
  return fetchApi<ApiOrderDetail>(`/api/orders/${id}/`);
}
