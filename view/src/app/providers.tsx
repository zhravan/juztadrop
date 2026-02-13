'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        theme="light"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: '!rounded-2xl !shadow-xl !border !border-foreground/10 !font-sans',
            title: '!font-semibold',
          },
        }}
      />
    </QueryClientProvider>
  );
}
