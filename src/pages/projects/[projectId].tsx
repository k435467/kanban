import React, { useState } from "react";
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
} from "antd";
import { ProjectsLayout } from "@/components/ProjectsLayout";
import { useRouter } from "next/router";
import {useTasks} from "@/utils/index";

const { Title } = Typography;

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

export default function Myspace() {
  const router = useRouter();
  const { projectId } = router.query;
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const {tasks} = useTasks(projectId as string)

  const handleModalOk = () => {
    setModalConfirmLoading(true);
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        // TODO - onCreate(values);
        console.log(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });

    setModalConfirmLoading(false);
    // setShowModal(false);
  };

  const handleFormFinish = (values: any) => {
    console.log(values);
  };

  return (
    <>
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
          onFinish={handleFormFinish}
          onFinishFailed={() => console.log("TODO")}
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

      <ProjectsLayout>
        <Layout.Header
          className="flex items-center"
          style={{ backgroundColor: token.colorBgBase }}
        >
          <Title level={3}>header</Title>
        </Layout.Header>
        <Layout.Content
          className="flex space-x-4 overflow-x-auto p-8"
          style={{ backgroundColor: token.colorBgBase }}
        >
          <ItemCollection title="backlog">
            <Item key="1" id="1" />
            <Item key="2" id="2" />
            <Item key="3" id="3" />
          </ItemCollection>
          <ItemCollection title="approved"></ItemCollection>
          <ItemCollection title="coding"></ItemCollection>
          <ItemCollection title="testing"></ItemCollection>
          <ItemCollection title="deployed"></ItemCollection>
        </Layout.Content>
        <Layout.Footer
          style={{ backgroundColor: token.colorBgBase }}
        ></Layout.Footer>
      </ProjectsLayout>
    </>
  );
}
