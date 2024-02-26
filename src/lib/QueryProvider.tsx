/**
 * @name QueryProvider
 * @description
 * @author darcrand
 */

'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'

export default function QueryProvider(props: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}
