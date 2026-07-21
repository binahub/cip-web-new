"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import AppToaster from "@/components/ui/AppToaster";
import { toastApiError } from "@/lib/toast";

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (typeof window !== "undefined") toastApiError(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (typeof window !== "undefined") toastApiError(error);
      },
    }),
    defaultOptions: {
      queries: {
        // Stale after 30s — balances freshness with reduced flicker on refocus
        staleTime: 30 * 1000,
        // Retry failed requests once by default
        retry: 1,
        // Avoid refetching on window focus in most cases
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AppToaster />
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
