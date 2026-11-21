import { baseApi } from '@/store/api/base-api';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({ url: '/orders' }),
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),
  }),
});

export const { useGetOrdersQuery } = ordersApi;
