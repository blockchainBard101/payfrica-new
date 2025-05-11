'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'

export const ClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}