import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    fetchTasksStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action) {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    createTaskSuccess(state, action) {
      state.loading = false;
      state.tasks.push(action.payload);
    },
    createTaskFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateTaskSuccess(state, action) {
      state.loading = false;
      const index = state.tasks.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    updateTaskFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteTaskSuccess(state, action) {
      state.loading = false;
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    },
    deleteTaskFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  createTaskStart,
  createTaskSuccess,
  createTaskFailure,
  updateTaskStart,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskStart,
  deleteTaskSuccess,
  deleteTaskFailure,
} = taskSlice.actions;

export default taskSlice.reducer;