import { baseApi } from '@/store/api/base-api';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ search = '', productType = '', limit = 8 } = {}) => ({
        url: '/products',
        params: {
          search: search || undefined,
          productType: productType || undefined,
          limit,
        },
      }),
      // Grow the list in one cache entry so loading more never replaces the
      // cards already on screen with skeletons.
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}(${queryArgs.search ?? ''}|${queryArgs.productType ?? ''})`,
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.limit !== previousArg?.limit,
      merge: (currentCache, newData) => {
        currentCache.data = newData.data;
        currentCache.total = newData.total;
        currentCache.page = newData.page;
        currentCache.limit = newData.limit;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((product) => ({ type: 'Product', id: product._id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProduct: builder.query({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    createProduct: builder.mutation({
      // Body is the Product schema without _id / seller / timestamps: the
      // backend fills those in. `images` are URL strings, so files must be
      // uploaded to the media service first.
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Product', id: 'LIST' },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} = productsApi;
