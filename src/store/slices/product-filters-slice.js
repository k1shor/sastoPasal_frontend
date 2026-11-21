import { createSlice } from '@reduxjs/toolkit';

export const PAGE_SIZE = 8;

const initialState = {
  search: '',
  productType: '', // '' | 'new' | 'used'
  limit: PAGE_SIZE,
};

const productFiltersSlice = createSlice({
  name: 'productFilters',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.limit = PAGE_SIZE;
    },
    setProductType(state, action) {
      state.productType = action.payload;
      state.limit = PAGE_SIZE;
    },
    loadMore(state) {
      state.limit += PAGE_SIZE;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setSearch, setProductType, loadMore, resetFilters } = productFiltersSlice.actions;

export const selectSearch = (state) => state.productFilters.search;
export const selectProductType = (state) => state.productFilters.productType;
export const selectProductFilters = (state) => state.productFilters;

export default productFiltersSlice.reducer;
