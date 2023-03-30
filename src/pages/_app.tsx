import '@/styles/globals.css'
import type { AppProps } from "next/app";
import { AuthUserProvider } from "@/components/AuthUserProvider";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthUserProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthUserProvider>
    </Provider>
  );
}
