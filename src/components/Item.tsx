import React from "react";
import { Typography, theme } from "antd";
import { useAppSelector } from "@/redux/store";
import { tasksSelectors } from "@/redux/tasksSlice";
import { EntityId } from "@reduxjs/toolkit";

const { Title, Text, Paragraph } = Typography;

export const Item = React.forwardRef<
  HTMLDivElement,
  { id: EntityId; [x: string]: any }
>(({ id, ...props }, ref) => {
  const { token } = theme.useToken();
  const task = useAppSelector((state) => tasksSelectors.selectById(state, id));

  if (!task) return null;

  return (
    <div
      ref={ref}
      className="w-full rounded p-4 shadow"
      {...props}
      style={{ backgroundColor: token.colorBgBase, ...props.style }}
    >
      <Title level={5}>{task.title}</Title>
      <Paragraph ellipsis={{ rows: 2 }}>{task.description}</Paragraph>
      <div className="flex items-center justify-between">
        {/* TODO - date, label */}
        <Text className="text-xs opacity-50">Mar 31</Text>
        <Text className="flex items-center rounded bg-cyan-100/30 px-2 text-xs font-medium">
          <div className="mr-1 h-1 w-1 rounded-full bg-cyan-500/70" />
          {task.label}
        </Text>
      </div>
    </div>
  );
});
