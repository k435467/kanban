import React from "react";
import { signOut } from "@/firebase/google";
import { theme, Layout, Button, Typography } from "antd";
import { ItemCollection } from "@/components/ItemCollection";
import { TbMoonStars, TbSun } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectThemeMode, switchTheme } from "@/redux/themeSlice";

const { Title } = Typography;

export default function Myspace() {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const { themeMode } = useAppSelector(selectThemeMode);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider theme="light" collapsible className="border-r">
        <Button ghost type="primary" block onClick={signOut}>
          Log Out
        </Button>
        <Button
          className="m-auto flex items-center justify-center"
          shape="circle"
          icon={
            themeMode === "dark" ? (
              <TbSun className="text-lg" />
            ) : (
              <TbMoonStars className="text-lg" />
            )
          }
          onClick={() => dispatch(switchTheme())}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          className="flex items-center"
          style={{ backgroundColor: token.colorBgBase }}
        >
          <Title level={3}>header</Title>
        </Layout.Header>
        <Layout.Content
          className="p-8 flex overflow-x-auto space-x-3"
          style={{ backgroundColor: token.colorBgBase }}
        >
          <ItemCollection title="backlog"></ItemCollection>
          <ItemCollection title="approved"></ItemCollection>
          <ItemCollection title="coding"></ItemCollection>
          <ItemCollection title="testing"></ItemCollection>
          <ItemCollection title="deployed"></ItemCollection>
        </Layout.Content>
        <Layout.Footer
          style={{ backgroundColor: token.colorBgBase }}
        ></Layout.Footer>
      </Layout>
    </Layout>
  );
}
