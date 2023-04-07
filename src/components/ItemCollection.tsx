import React from "react";
import { theme, Typography } from "antd";

const { Title } = Typography;

export const ItemCollection = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    children?: React.ReactNode;
  }
>(({ title, children, ...props }, ref) => {
  const { token } = theme.useToken();

  return (
    <div
      className="h-full w-64 shrink-0 rounded-lg p-3 pt-1"
      style={{ backgroundColor: token.colorBgLayout }}
    >
      <Title level={5} className="capitalize">
        {title}
      </Title>
      <div className="h-full space-y-3 overflow-y-auto" ref={ref} {...props}>
        {children}
      </div>
    </div>
  );
});
