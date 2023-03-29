import '@/styles/globals.css'
import type { AppProps } from "next/app";
import { AuthUserProvider } from "@/components/AuthUserProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}
