import React from "react";
import { Typography, theme } from "antd";

const { Text, Paragraph } = Typography;

export const Item: React.FC<{ id: string }> = ({ id }) => {
  const { token } = theme.useToken();

  return (
    <div
      className="w-full p-4 rounded shadow"
      style={{ backgroundColor: token.colorBgBase }}
    >
      <Paragraph ellipsis={{ rows: 2 }}>
        Something text. Something text. Something text. Something text.
      </Paragraph>
      <div className="flex justify-between items-center">
        <Text className="opacity-50 text-xs">Mar 31</Text>
        <Text className="flex items-center font-medium bg-cyan-100/30 px-2 rounded text-xs">
          <div className="w-1 h-1 mr-1 rounded-full bg-cyan-500/70" />
          Feature Request
        </Text>
      </div>
    </div>
  );
};
