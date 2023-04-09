import React from "react";
import { Typography, theme, Rate } from "antd";
import { useAppSelector } from "@/redux/store";
import { tasksSelectors } from "@/redux/tasksSlice";
import { EntityId } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { TaskLabel } from "@/types";

const { Title, Text, Paragraph } = Typography;

const labelColor: { [x in TaskLabel]: { dot: string; bg: string } } = {
  bug: { dot: "bg-pink-500/70", bg: "bg-pink-100/30" },
  feature: { dot: "bg-cyan-500/70", bg: "bg-cyan-100/30" },
  enhancement: { dot: "bg-yellow-500/70", bg: "bg-yellow-100/30" },
};

export const Item = React.forwardRef<
  HTMLDivElement,
  { id: EntityId; onClick: () => void; [x: string]: any }
>(({ id, onClick, ...props }, ref) => {
  const { token } = theme.useToken();
  const task = useAppSelector((state) => tasksSelectors.selectById(state, id));

  const dateText = (() => {
    const create = dayjs(task?.createDate).format("MMM DD");
    const due = task?.due ? dayjs(task.due).format("MMM DD") : "";
    return `${create}${due && ` - ${due}`}`;
  })();

  if (!task) return null;
  return (
    <div
      ref={ref}
      className="w-full rounded p-4 shadow"
      {...props}
      style={{ backgroundColor: token.colorBgBase, ...props.style }}
      onClick={onClick}
    >
      <Title level={5}>{task.title}</Title>
      {task.description && (
        <Paragraph ellipsis={{ rows: 2 }}>{task.description}</Paragraph>
      )}
      {Boolean(task.priority && task.priority > 0) && (
        <Rate
          className="relative left-0 top-0 my-[-8px] origin-top-left scale-50"
          value={task.priority}
          disabled
        />
      )}
      <div className="flex items-center justify-between">
        <Text className="text-xs opacity-50">{dateText}</Text>
        <Text
          className={`flex items-center rounded ${
            labelColor[task.label].bg
          } px-2 text-xs font-medium`}
        >
          <div
            className={`${
              labelColor[task.label].dot
            } mr-1 h-1 w-1 rounded-full`}
          />
          {task.label}
        </Text>
      </div>
    </div>
  );
});
