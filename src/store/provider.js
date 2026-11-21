'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';

export function StoreProvider({ children }) {
  // One store per browser session; the lazy initializer keeps it stable across renders.
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
