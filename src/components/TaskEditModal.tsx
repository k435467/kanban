import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import dayjs from "dayjs";
import { Task } from "@/types";
import { Modal, Form, message, Button, Space, Popconfirm } from "antd";
import { useRouter } from "next/router";
import { delTask, updateTask } from "@/utils/firestore";
import { useAuth } from "@/utils/auth";
import { fetchTasks, tasksSelectors } from "@/redux/tasksSlice";
import { TaskForm } from "@/components/TaskForm";
import { EntityId } from "@reduxjs/toolkit";

export const TaskEditModal: React.FC<{
  taskId: EntityId | null;
  setTaskId: React.Dispatch<React.SetStateAction<EntityId | null>>;
}> = ({ taskId, setTaskId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { projectId } = router.query;
  const dispatch = useAppDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [delLoading, setDelLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const initValues = useAppSelector((state) =>
    tasksSelectors.selectById(state, taskId ?? -1)
  );

  useEffect(() => {
    setShow(taskId ? true : false);
  }, [taskId]);
  useEffect(() => {
    if (!show) setTaskId(null);
  }, [show]);

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values: Task) => {
        const { id, ...restValues } = values;
        const newTask: Task = {
          ...restValues,
          due: dayjs(values.due).format(),
        };
        setConfirmLoading(true);
        updateTask(user?.uid ?? "", projectId as string, taskId!, newTask)
          .then(() => {
            form.resetFields();
            messageApi.success("The task updated!");
            dispatch(
              fetchTasks({
                userId: user?.uid ?? "",
                projectId: projectId as string,
              })
            );
            setShow(false);
          })
          .catch((e) => {
            messageApi.error("Failed!");
            console.error(e);
          })
          .finally(() => {
            setConfirmLoading(false);
          });
      })
      .catch((e) => {
        console.error("Validate Failed: ", e);
      });
  };

  const handelDel = () => {
    setDelLoading(true);
    delTask(user?.uid ?? "", projectId as string, taskId!)
      .then(() => {
        messageApi.success("The task deleted!");
        dispatch(
          fetchTasks({
            userId: user?.uid ?? "",
            projectId: projectId as string,
          })
        );
        setShow(false);
      })
      .catch((e) => {
        messageApi.error("Failed!");
        console.error(e);
      })
      .finally(() => {
        setDelLoading(false);
      });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="New Task"
        open={show}
        onCancel={() => setShow(false)}
        footer={
          <div className="flex justify-between">
            <Popconfirm title="Delete the task" onConfirm={handelDel}>
              <Button danger loading={delLoading}>
                Delete
              </Button>
            </Popconfirm>
            <Space>
              <Button onClick={() => setShow(false)}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleModalOk}
                loading={confirmLoading}
              >
                OK
              </Button>
            </Space>
          </div>
        }
      >
        <TaskForm form={form} init={initValues} taskId={taskId} />
      </Modal>
    </>
  );
};
