import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Task, TaskStatus } from "@/types";
import { Form, Input, Select, Rate, DatePicker, FormInstance } from "antd";
import { EntityId } from "@reduxjs/toolkit";

const taskLabels = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "enhancement", label: "Enhancement" },
];
const taskStatus: { value: TaskStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];
const formInitValues: Task = {
  title: "",
  label: "feature",
  status: "open",
};

export const TaskForm: React.FC<{
  form: FormInstance<Task>;
  init?: Task;
  taskId?: EntityId | null;
}> = ({ form, init = formInitValues, taskId }) => {
  const initValuse = (() => {
    if (!init.due) return init;
    return { ...init, due: dayjs(init.due) };
  })();

  useEffect(() => {
    form.resetFields();
  }, [taskId, init]);

  return (
    <Form
      name="task"
      layout="vertical"
      requiredMark="optional"
      form={form}
      initialValues={initValuse}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ min: 1, required: true, max: 100 }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ max: 1000 }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Label" name="label" required>
        <Select options={taskLabels} />
      </Form.Item>
      <Form.Item label="Status" name="status" required>
        <Select options={taskStatus} />
      </Form.Item>
      <Form.Item label="Priority" name="priority">
        <Rate />
      </Form.Item>
      <Form.Item label="Due Date" name="due">
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: dayjs("00:00:01", "HH:mm:ss") }}
        />
      </Form.Item>
    </Form>
  );
};
