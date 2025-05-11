// "use client"; // Not needed here unless you use client hooks
import "./globals.css";

import { ToastContainer } from "react-toastify";
import { ProvidersAndLayout } from "../components/ProvidersAndLayout";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStateProvider } from "@/GlobalStateProvider";
import { ClientProvider } from "@/components/client-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Optional: Add default metadata */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Payfrica</title>
      </head>
      <body className="antialiased bg-background text-foreground">
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
      </body>
    </html>
  );
}
