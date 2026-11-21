import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { categories } from '@/mocks/categories';
import { orders } from '@/mocks/orders';
import { products } from '@/mocks/products';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 24-char hex id so mocked records look like real MongoDB ObjectIds.
const objectId = () =>
  Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0') +
  Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

async function mockBaseQuery({ url, method = 'GET', params, body } = {}) {
  // Simulated network latency so loading states are actually visible.
  await delay(900);

  if (url === '/categories' && method === 'POST') {
    const now = new Date().toISOString();
    const created = {
      _id: objectId(),
      name: (body?.name ?? '').trim(),
      slug: (body?.slug ?? '').trim().toLowerCase(),
      description: body?.description ?? '',
      image: body?.image ?? '',
      parent: body?.parent ?? null,
      isActive: body?.isActive ?? true,
      productCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    categories.unshift(created);
    return { data: created };
  }

  // Single category: GET /categories/:id and PATCH /categories/:id
  if (url.startsWith('/categories/')) {
    const id = url.split('/')[2];
    const index = categories.findIndex((category) => category._id === id);
    if (index === -1) {
      return { error: { status: 404, data: { message: 'Category not found' } } };
    }

    if (method === 'GET') {
      // Copy so RTK Query's deep freeze never locks the in-memory mock records.
      return { data: { data: { ...categories[index] } } };
    }

    if (method === 'PATCH') {
      const changes = Object.fromEntries(
        Object.entries(body ?? {}).filter(([, value]) => value !== undefined),
      );
      const updated = {
        ...categories[index],
        ...changes,
        _id: categories[index]._id,
        productCount: categories[index].productCount,
        createdAt: categories[index].createdAt,
        updatedAt: new Date().toISOString(),
      };
      categories[index] = updated;
      return { data: updated };
    }

    return { error: { status: 405, data: { message: `Method not allowed: ${method}` } } };
  }

  if (url === '/categories') {
    // Copy so RTK Query's deep freeze never locks the in-memory mock records.
    return { data: { data: categories.map((category) => ({ ...category })) } };
  }

  if (url === '/orders') {
    // Copy so RTK Query's deep freeze never locks the in-memory mock records.
    // The API must populate items.product (name, image); the mock joins it here.
    return {
      data: {
        data: orders.map((order) => ({
          ...order,
          items: order.items.map((item) => {
            const product = products.find((entry) => entry._id === item.product);

            return {
              ...item,
              product: product
                ? { _id: product._id, name: product.name, image: product.image }
                : item.product,
            };
          }),
          shippingAddress: { ...order.shippingAddress },
        })),
      },
    };
  }

  if (url === '/products' && method === 'POST') {
    const now = new Date().toISOString();
    const created = {
      _id: objectId(),
      name: body?.name ?? '',
      description: body?.description ?? '',
      price: Number(body?.price) || 0,
      category: body?.category ?? '',
      brand: body?.brand ?? '',
      images: body?.images ?? [],
      image: body?.image || body?.images?.[0] || '',
      stock: Number(body?.stock) || 0,
      productType: body?.productType === 'used' ? 'used' : 'new',
      usedCondition: body?.usedCondition ?? '',
      productAge: body?.productAge ?? '',
      defects: body?.defects ?? '',
      seller: '665f1c1a9b1e8a3f4c2d0001',
      isAvailable: body?.isAvailable ?? true,
      createdAt: now,
      updatedAt: now,
    };

    products.unshift(created);
    return { data: created };
  }

  // Single product: GET /products/:id and PATCH /products/:id
  if (url.startsWith('/products/')) {
    const id = url.split('/')[2];
    const index = products.findIndex((product) => product._id === id);
    if (index === -1) {
      return { error: { status: 404, data: { message: 'Product not found' } } };
    }

    if (method === 'GET') {
      return { data: { data: products[index] } };
    }

    if (method === 'PATCH') {
      const changes = Object.fromEntries(
        Object.entries(body ?? {}).filter(([, value]) => value !== undefined),
      );
      const updated = {
        ...products[index],
        ...changes,
        _id: products[index]._id,
        seller: products[index].seller,
        createdAt: products[index].createdAt,
        updatedAt: new Date().toISOString(),
      };
      products[index] = updated;
      return { data: updated };
    }

    return { error: { status: 405, data: { message: `Method not allowed: ${method}` } } };
  }

  if (url === '/products') {
    const search = (params?.search ?? '').trim().toLowerCase();
    const productType = params?.productType;
    const limit = Number(params?.limit) || 8;

    let data = products;

    if (search) {
      data = data.filter((product) =>
        [product.name, product.brand, product.description].some((value) =>
          value?.toLowerCase().includes(search),
        ),
      );
    }

    if (productType) {
      data = data.filter((product) => product.productType === productType);
    }

    return {
      data: { data: data.slice(0, limit), total: data.length, page: 1, limit },
    };
  }

  return { error: { status: 404, data: { message: `Mock endpoint not found: ${url}` } } };
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: API_BASE_URL ? fetchBaseQuery({ baseUrl: API_BASE_URL }) : mockBaseQuery,
  tagTypes: ['Product', 'Category', 'Order'],
  endpoints: () => ({}),
});
