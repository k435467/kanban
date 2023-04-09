import React, { useMemo } from "react";
import { signOut } from "@/firebase/google";
import { TbMoonStars, TbSun } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { selectThemeMode, switchTheme } from "@/redux/themeSlice";
import { AiOutlineLogout, AiOutlineHome } from "react-icons/ai";
import { Layout, Menu, MenuProps, Spin } from "antd";
import { useProjects } from "@/utils/index";
import { useRouter } from "next/router";

export const ProjectsLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { themeMode } = useAppSelector(selectThemeMode);
  const router = useRouter();

  const { projects, loading } = useProjects();

  const settingItems: MenuProps["items"] = [
    {
      label: "Logout",
      key: "logout",
      icon: <AiOutlineLogout />,
      onClick: signOut,
    },
    {
      label: "Change Theme",
      key: "change theme",
      icon: themeMode === "light" ? <TbSun /> : <TbMoonStars />,
      onClick: () => dispatch(switchTheme()),
    },
  ];

  const projectItemsChildren = useMemo(
    () =>
      projects.map((p) => ({
        label: p.title,
        key: p.id ?? p.title,
        onClick: () => {
          router.push(`/projects/${p.id}`);
        },
      })),
    [projects]
  );

  const projectItems: MenuProps["items"] = [
    {
      label: "Home",
      key: "home",
      icon: <AiOutlineHome />,
      onClick: () => {
        router.push("/projects");
      },
    },
    {
      type: "group",
      label: "Projects",
      key: "projects",
      children: projectItemsChildren,
    },
  ];

  if (!router.asPath.startsWith("/projects")) return <>{children}</>;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider theme="light" collapsible className="border-r">
        <Menu selectable={false} mode="inline" items={settingItems} />
        {loading ? (
          <div className="mt-20 flex justify-center">
            <Spin />
          </div>
        ) : (
          <Menu
            selectable={false}
            className=""
            mode="inline"
            items={projectItems}
          />
        )}
      </Layout.Sider>
      <Layout>{children}</Layout>
    </Layout>
  );
};
