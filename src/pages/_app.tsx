import "@/styles/globals.css";
import "@/styles/tailwindPreflight.css";
import type { AppProps } from "next/app";
import { AuthUserProvider } from "@/components/AuthUserProvider";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProjectsLayout } from "@/components/ProjectsLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthUserProvider>
        <ThemeProvider>
          <ProjectsLayout>
            <Component {...pageProps} />
          </ProjectsLayout>
        </ThemeProvider>
      </AuthUserProvider>
    </Provider>
  );
}
