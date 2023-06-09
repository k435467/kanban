import Head from "next/head";
import { signIn } from "@/firebase/google";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/auth";
import { useEffect } from "react";
import { Button, Typography, theme } from "antd";
import { HiOutlineClipboardList } from "react-icons/hi";

const { Title, Text } = Typography;

/**
 * redirect if user has logged in
 */
const useRedirect = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/projects");
    }
  }, [loading, user]);

  useEffect(() => {
    router.prefetch("/projects");
  }, []);
};

export default function Home() {
  useRedirect();
  const { token } = theme.useToken();
  return (
    <>
      <Head>
        <title>Kanban</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto mt-32 flex flex-col items-center">
        <HiOutlineClipboardList
          className="text-9xl"
          style={{ color: token.colorPrimary }}
        />
        <Title level={3}>Welcome Kanban!</Title>
        <Title level={4} className="text-center">
          It is a project management tool designed to help visualize work, limit
          work-in-progress, and maximize efficiency or flow
        </Title>
        <Button onClick={signIn} className="mt-10 mb-2 w-80">
          <div className="flex items-center justify-center">
            <FcGoogle className="mr-2" />
            Continue with Google
          </div>
        </Button>
        <Text className="opacity-60">
          Secured by{" "}
          <a
            className="!text-inherit !underline"
            href="https://firebase.google.com/"
          >
            Firebase
          </a>
        </Text>
      </div>
    </>
  );
}
