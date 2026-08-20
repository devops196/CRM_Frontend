'use client';

import React from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from '../contexts/ThemeContext.jsx';
import { CRMStateProvider } from '../contexts/CRMStateContext.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';

export function Providers({ children }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider>
        <CRMStateProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </CRMStateProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
