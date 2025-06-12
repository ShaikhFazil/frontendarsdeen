import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
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
} from "../redux/taskSlice";
import axios from "axios";
import { TASK_API_END_POINT } from "@/constants/index";
import axiosInstance from "@/utils/axiosConfig";

const useTask = () => {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);

const fetchTasks = async () => {
  try {
    dispatch(fetchTasksStart());
    const res = await axiosInstance.get(TASK_API_END_POINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const { tasks, count } = res.data;
console.log(tasks)
  dispatch(fetchTasksSuccess({ tasks, count }));

  } catch (error) {
    dispatch(fetchTasksFailure(error.message));
    toast.error("Failed to fetch tasks");
  }
};



  const createTask = async (taskData) => {
    try {
      dispatch(createTaskStart());
      const res = await axiosInstance.post(TASK_API_END_POINT, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(createTaskSuccess(res.data));
      toast.success("Task created successfully");
      return true;
    } catch (error) {
      dispatch(createTaskFailure(error.message));
      toast.error("Failed to create task");
      return false;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      dispatch(updateTaskStart());
      const res = await axiosInstance.put(`${TASK_API_END_POINT}/${id}`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(updateTaskSuccess(res.data));
      toast.success("Task updated successfully");
      return true;
    } catch (error) {
      dispatch(updateTaskFailure(error.message));
      toast.error("Failed to update task");
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
        console.log("Deleting task with ID:", id);
      dispatch(deleteTaskStart());
      await axiosInstance.delete(`${TASK_API_END_POINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      dispatch(deleteTaskSuccess(id));
      toast.success("Task deleted successfully");
      return true;
    } catch (error) {
      dispatch(deleteTaskFailure(error.message));
      toast.error("Failed to delete task");
      return false;
    }
  };

  return {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};

export default useTask;