import {
  collection,
  addDoc,
  doc,
  getDocs,
  // query,
  // where,
  // deleteDoc,
  // getDoc,
  // updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/index";
import { Project, Task } from "@/types";

export const getProjects = (userId: string) =>
  new Promise<Project[]>(async (resolve, reject) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const projectsCollRef = collection(userDocRef, "projects");
      const querySnapshot = await getDocs(projectsCollRef);
      let projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        projects.push({
          id: doc.id,
          title: doc.data().title as string,
        });
      });
      return resolve(projects);
    } catch (e) {
      return reject(new Error("Error getting projects: " + e));
    }
  });

export const addProject = (userId: string, title: string) =>
  new Promise<string>(async (resolve, reject) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const projectsCollRef = collection(userDocRef, "projects");
      const projectRef = await addDoc(projectsCollRef, { title } as Project);
      if (projectRef.id) {
        return resolve(projectRef.id);
      } else {
        return reject(new Error("Add project failed!"));
      }
    } catch (e) {
      return reject(new Error("Error adding project: " + e));
    }
  });

export const getProjectTasks = (userId: string, projectId: string) =>
  new Promise<Task[]>(async (resolve, reject) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const prjTasksCollRef = collection(
        userDocRef,
        "projects",
        projectId,
        "tasks"
      );
      const querySnapshot = await getDocs(prjTasksCollRef);
      let tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push(doc.data() as Task);
      });
      return resolve(tasks);
    } catch (e) {
      return reject(new Error("Error getting project: " + e));
    }
  });

export const addTask = (userId: string, projectId: string, task: Task) =>
  new Promise<string>(async (resolve, reject) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const prjTasksCollRef = collection(
        userDocRef,
        "projects",
        projectId,
        "tasks"
      );
      const taskRef = await addDoc(prjTasksCollRef, task);
      if (taskRef.id) {
        return resolve(taskRef.id);
      } else {
        return reject(new Error("Adding task failed!"));
      }
    } catch (e) {
      return reject(new Error("Error adding task: " + e));
    }
  });
