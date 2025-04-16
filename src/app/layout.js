// "use client";
import "./globals.css";
import { GlobalStateProvider } from "@/imports";
import { ToastContainer } from "react-toastify";
import { ProvidersAndLayout } from "./ProvidersAndLayout";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <GlobalStateProvider>
      <html lang="en">
        <body>
          <ProvidersAndLayout>
            {children}
          </ProvidersAndLayout>
        </body>
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
        // transition={Bounce}
        />
      </html>
    </GlobalStateProvider>
  );
}
