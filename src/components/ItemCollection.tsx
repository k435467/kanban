import React from "react";
import { theme, Typography } from "antd";

const { Title } = Typography;

export const ItemCollection: React.FC<{ title: string }> = ({ title }) => {
  const { token } = theme.useToken();

  return (
    <div
      className="shrink-0 p-2 pt-1 h-full w-56 rounded-lg"
      style={{ backgroundColor: token.colorBgLayout }}
    >
      <Title level={5} className="capitalize">
        {title}
      </Title>
    </div>
  );
};
