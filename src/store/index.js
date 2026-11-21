import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/store/api/base-api';
import productFiltersReducer from '@/store/slices/product-filters-slice';

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      productFilters: productFiltersReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
