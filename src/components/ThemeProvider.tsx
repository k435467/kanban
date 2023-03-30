import React from "react";
import { ConfigProvider, theme } from "antd";
import { useAppSelector } from "@/redux/store";
import { selectThemeMode } from "@/redux/themeSlice";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { themeMode } = useAppSelector(selectThemeMode);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};
