import { Task } from "@/types";
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
  EntityId,
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import { getProjectTasks } from "@/utils/firestore";
import dayjs from "dayjs";
import { cmpTaskStatus } from "@/utils";

const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (params: { userId: string; projectId: string }, thunkAPI) => {
    const tasks = await getProjectTasks(params.userId, params.projectId);
    return tasks;
  }
);

// ----

const taskCmpFn = (a: Task, b: Task) => {
  if (a.phase! < b.phase!) return -1;
  else if (a.phase! > b.phase!) return 1;
  else {
    // same phase
    if (cmpTaskStatus(a, b) !== 0) return cmpTaskStatus(a, b);
    if ((a.priority ?? 0) < (b.priority ?? 0)) return 1;
    else if ((a.priority ?? 0) > (b.priority ?? 0)) return -1;
    else {
      // same priority
      return dayjs(a.createDate).isBefore(dayjs(b.createDate)) ? 0 : 1;
    }
  }
};

export const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: taskCmpFn,
});

const initialState = tasksAdapter.getInitialState<{
  loading: boolean;
  error: string | null;
  bucketSize: number[];
}>({
  loading: false,
  error: null,
  bucketSize: [],
});

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    taskMovePhase: (
      state,
      action: PayloadAction<{ id: EntityId; to: number }>
    ) => {
      const id = action.payload.id;
      const phase = state.entities[id]?.phase;
      if (typeof phase !== "undefined") {
        --state.bucketSize[phase];
        const to = action.payload.to;
        ++state.bucketSize[to];
        tasksAdapter.updateOne(state, { id, changes: { phase: to } });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const bucketSize: number[] = [0, 0, 0, 0, 0, 0];
        action.payload.forEach((task) => {
          ++bucketSize[task.phase!];
        });
        tasksAdapter.setAll(state, action);
        state.bucketSize = bucketSize;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export { fetchTasks };
export const { taskMovePhase } = tasksSlice.actions;

export const tasksSelectors = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks
);
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksBucketSize = (state: RootState) =>
  state.tasks.bucketSize;
export default tasksSlice.reducer;
