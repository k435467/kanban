import { useEffect } from "react";
import { useAuth } from "@/utils/auth";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchProjects, selectProjects } from "@/redux/projectsSlice";
import {
  fetchTasks,
  selectTasksBucketSize,
  selectTasksLoading,
  tasksSelectors,
} from "@/redux/tasksSlice";

export const useProjects = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { projects, loading } = useAppSelector(selectProjects);

  useEffect(() => {
    if (user?.uid) dispatch(fetchProjects(user.uid));
  }, [user]);

  return { projects, loading };
};

export const useTasks = (projectId: string) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const tasksIds = useAppSelector(tasksSelectors.selectIds);
  const loading = useAppSelector(selectTasksLoading);
  const bucketSize = useAppSelector(selectTasksBucketSize);

  useEffect(() => {
    if (user?.uid) dispatch(fetchTasks({ userId: user.uid, projectId }));
  }, [user, projectId]);

  return { tasksIds, loading, bucketSize };
};
