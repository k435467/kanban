import React, { useMemo, useState } from "react";
import { ItemCollection } from "@/components/ItemCollection";
import { useAppDispatch } from "@/redux/store";
import { Item } from "@/components/Item";
import { AiOutlinePlus } from "react-icons/ai";
import dayjs from "dayjs";
import { Task } from "@/types";
import {
  theme,
  Layout,
  Typography,
  FloatButton,
  Modal,
  Form,
  Input,
  Select,
  Rate,
  DatePicker,
  message,
} from "antd";
import { useRouter } from "next/router";
import { useTasks } from "@/utils/index";
import { addTask, updateTask } from "@/utils/firestore";
import { useAuth } from "@/utils/auth";
import { fetchTasks, taskMovePhase } from "@/redux/tasksSlice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const { Title } = Typography;

const collectionTitles = [
  "backlog",
  "approved",
  "coding",
  "testing",
  "deployed",
];
const taskLabels = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "enhancement", label: "Enhancement" },
];
const taskStatus = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];
const formInitValues: Task = {
  title: "",
  label: "feature",
  status: "open",
};

export default function Project() {
  const { user } = useAuth();
  const router = useRouter();
  const { projectId } = router.query;
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { tasksIds, loading, bucketSize } = useTasks(projectId as string);
  const [messageApi, contextHolder] = message.useMessage();

  // bucket startId and endId = buckets[i], buckets[i+1]
  const buckets = useMemo(() => {
    const v = [0, ...bucketSize];
    for (let i = 1; i < v.length; ++i) {
      v[i] = v[i - 1] + v[i];
    }
    return v;
  }, [tasksIds, bucketSize]);

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values: Task) => {
        const newTask: Task = {
          ...values,
          due: dayjs(values.due).format(),
          phase: 0,
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
          .catch(() => {
            messageApi.error("Failed!");
          })
          .finally(() => {
            setModalConfirmLoading(false);
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <>
      <Layout.Header
        className="flex items-center"
        style={{ backgroundColor: token.colorBgBase }}
      >
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
          <Form
            name="task"
            layout="vertical"
            requiredMark="optional"
            form={form}
            initialValues={formInitValues}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ min: 1, required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
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
            {/* TODO - timeline created updated closed */}
          </Form>
        </Modal>
        <Title level={3}>header</Title>
      </Layout.Header>
      <Layout.Content
        className="flex space-x-4 overflow-x-auto p-8"
        style={{ backgroundColor: token.colorBgBase }}
      >
        <DragDropContext
          onDragEnd={(result) => {
            if (
              result.source &&
              result.destination &&
              result.source.droppableId !== result.destination.droppableId
            ) {
              const srcPhase = parseInt(result.source.droppableId);
              const draggedTaskId = tasksIds.slice(
                buckets[srcPhase],
                buckets[srcPhase + 1]
              )[result.source.index];
              const toPhase = parseInt(result.destination.droppableId);
              dispatch(taskMovePhase({ id: draggedTaskId, to: toPhase }));
              updateTask(user!.uid, projectId as string, draggedTaskId, {
                phase: toPhase,
              }).catch(() => {
                messageApi.error("Update Failed!");
                dispatch(taskMovePhase({ id: draggedTaskId, to: srcPhase }));
              });
            }
          }}
        >
          {collectionTitles.map((title, idx) => (
            <Droppable droppableId={idx.toString()} key={`droppable-${title}`}>
              {(provided, snapshot) => (
                <ItemCollection
                  ref={provided.innerRef}
                  key={title}
                  title={title}
                  {...provided.droppableProps}
                >
                  {tasksIds
                    .slice(buckets[idx], buckets[idx + 1])
                    .map((id, idx) => (
                      <Draggable
                        key={id}
                        draggableId={id.toString()}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <Item
                            key={id}
                            id={id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ItemCollection>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Layout.Content>
      <Layout.Footer
        style={{ backgroundColor: token.colorBgBase }}
      ></Layout.Footer>
    </>
  );
}
