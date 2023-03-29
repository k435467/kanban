import React, { useEffect } from "react";
import { useFirebaseAuth, authContext } from "@/utils/auth";
import { useRouter } from "next/router";

/**
 * context provider. use useAuth to retrieve the value
 */
export const AuthUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useFirebaseAuth();

  // redirect to homepage if not logged in
  const router = useRouter();
  useEffect(() => {
    if (!auth.loading && !auth.user && router.asPath !== "/") router.push("/");
  }, [auth]);

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
