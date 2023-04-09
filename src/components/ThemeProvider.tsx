import React, { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectThemeMode, setTheme } from "@/redux/themeSlice";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { themeMode } = useAppSelector(selectThemeMode);

  useEffect(() => {
    if (!themeMode) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document?.documentElement.classList.add("dark");
        dispatch(setTheme("dark"));
      } else {
        document?.documentElement.classList.remove("dark");
        dispatch(setTheme("light"));
      }
    }

    if (themeMode === "dark") {
      document?.documentElement.classList.add("dark");
    } else if (themeMode === "light") {
      document?.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#ff1794",
          colorBgLayout: "rgba(200, 200, 200, 0.2)",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
