import React, { useEffect } from "react";
import {
  Button,
  theme,
  Layout,
  Typography,
  Space,
  Input,
  Form,
  message,
} from "antd";
import { addProject } from "@/utils/firestore";
import { useAuth } from "@/utils/auth";
import { useAppDispatch } from "@/redux/store";
import { fetchProjects } from "@/redux/projectsSlice";
import { useRouter } from "next/router";

const { Title, Text } = Typography;

export default function Projects() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (router.query.del) {
      messageApi.success("The project deleted!");
      router.push("/projects");
    }
  }, [router.query]);

  const handleCreateProject = (v: { title: string }) => {
    if (user?.uid) {
      addProject(user.uid, v.title)
        .then(() => {
          form.resetFields();
          messageApi.success("Project Created!");
          dispatch(fetchProjects(user.uid));
        })
        .catch(() => {
          messageApi.error("Failed!");
        });
    }
  };

  return (
    <>
      {contextHolder}
      <Layout.Header
        className="flex items-center"
        style={{ backgroundColor: token.colorBgBase }}
      >
        <Title className="!mb-0" level={3}>
          Workspace
        </Title>
      </Layout.Header>
      <Layout.Content
        className="flex flex-col items-center justify-center space-y-4 p-8"
        style={{ backgroundColor: token.colorBgBase }}
      >
        <Text>Select a project from side bar or create a new one.</Text>
        <Form
          form={form}
          name="createProject"
          autoComplete="off"
          onFinish={handleCreateProject}
        >
          <Space.Compact>
            <Form.Item
              name="title"
              rules={[{ required: true, min: 1, max: 100 }]}
            >
              <Input placeholder="Project Title" />
            </Form.Item>
            <Button htmlType="submit">Create Project</Button>
          </Space.Compact>
        </Form>
      </Layout.Content>
      <Layout.Footer
        style={{ backgroundColor: token.colorBgBase }}
      ></Layout.Footer>
    </>
  );
}
