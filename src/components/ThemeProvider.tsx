import React, { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { useAppSelector } from "@/redux/store";
import { selectThemeMode } from "@/redux/themeSlice";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { themeMode } = useAppSelector(selectThemeMode);

  useEffect(() => {
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
          colorBgLayout: "rgba(200, 200, 200, 0.2)",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
