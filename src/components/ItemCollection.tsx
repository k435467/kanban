import React from "react";
import { theme, Typography } from "antd";

const { Title } = Typography;

export const ItemCollection: React.FC<{
  title: string;
  children?: React.ReactNode;
}> = ({ title, children }) => {
  const { token } = theme.useToken();

  return (
    <div
      className="shrink-0 p-3 pt-1 h-full w-64 rounded-lg"
      style={{ backgroundColor: token.colorBgLayout }}
    >
      <Title level={5} className="capitalize">
        {title}
      </Title>
      <div className="space-y-3">{children}</div>
    </div>
  );
};
