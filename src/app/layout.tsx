import "./globals.css";
import { ToastContainer } from "react-toastify";
import { ProvidersAndLayout } from "../components/ProvidersAndLayout";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStateProvider } from "@/GlobalStateProvider";
import { ClientProvider } from "@/components/client-provider";
import React, { Suspense } from "react";
import LogoLoader from "@/components/LogoLoader";
//import {QueryClientProvider, QueryClient} from '@tanstack/react-query'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <title>Payfrica</title>
      </head>
      <body className="antialiased bg-background text-foreground">
        {/*<Suspense fallback={<LogoLoader />}>*/}
        <ClientProvider>
          <GlobalStateProvider>
            <ProvidersAndLayout>{children}</ProvidersAndLayout>
          </GlobalStateProvider>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ClientProvider>
        {/*</Suspense>*/}
      </body>
    </html>
  );
}
