import { useEffect, useState } from "react";
import { useAuth } from "@/utils/auth";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchProjects, selectProjects } from "@/redux/projectsSlice";
import { Task } from "@/types";
import { getProjectTasks } from "./firestore";

export const useProjects = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { projects, loading } = useAppSelector(selectProjects);

  useEffect(() => {
    if (user?.uid && projects.length === 0) dispatch(fetchProjects(user.uid));
  }, [user]);

  return { projects, loading };
};

export const useTasks = (projectId: string) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.uid && projectId) {
      setLoading(true);
      getProjectTasks(user.uid, projectId)
        .then((v) => {
          setTasks(v);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [projectId]);

  return { tasks, loading };
};
