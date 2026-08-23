'use client';

import React from 'react';
import '../index.css';
import '../App.css';
import { Providers } from '../app/providers.jsx';

export default function MyApp({ Component, pageProps }) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
