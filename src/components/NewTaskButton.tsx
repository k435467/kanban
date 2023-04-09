import React, { useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { AiOutlinePlus } from "react-icons/ai";
import dayjs from "dayjs";
import { Task } from "@/types";
import { FloatButton, Modal, Form, message } from "antd";
import { useRouter } from "next/router";
import { addTask } from "@/utils/firestore";
import { useAuth } from "@/utils/auth";
import { fetchTasks } from "@/redux/tasksSlice";
import { TaskForm } from "@/components/TaskForm";

export const NewTaskButton: React.FC<{}> = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { projectId } = router.query;
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values: Task) => {
        const { due, ...restValues } = values;
        const newTask: Task = {
          ...restValues,
          ...(due && { due: dayjs(values.due).format() }),
          phase: 0,
          createDate: dayjs().format(),
        };
        setModalConfirmLoading(true);
        addTask(user?.uid ?? "", projectId as string, newTask)
          .then(() => {
            form.resetFields();
            messageApi.success("The task added!");
            dispatch(
              fetchTasks({
                userId: user?.uid ?? "",
                projectId: projectId as string,
              })
            );
            setShowModal(false);
          })
          .catch((e) => {
            messageApi.error("Failed!");
            console.error(e);
          })
          .finally(() => {
            setModalConfirmLoading(false);
          });
      })
      .catch((e) => {
        console.error("Validate Failed: ", e);
      });
  };

  return (
    <>
      {contextHolder}
      <FloatButton
        shape="square"
        type="primary"
        tooltip="Add Task"
        icon={<AiOutlinePlus />}
        onClick={() => setShowModal(true)}
      />
      <Modal
        title="New Task"
        open={showModal}
        onOk={handleModalOk}
        confirmLoading={modalConfirmLoading}
        onCancel={() => setShowModal(false)}
      >
        <TaskForm form={form} />
      </Modal>
    </>
  );
};
