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
            console.log(tasks);
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

    const createAdminTask = async (taskData) => {
        try {
            dispatch(createTaskStart());
            const res = await axiosInstance.post(`${TASK_API_END_POINT}/admin`, taskData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            dispatch(createTaskSuccess(res.data.task));
            toast.success("Task assigned successfully");
            return true;
        } catch (error) {
            dispatch(createTaskFailure(error.message));
            toast.error("Failed to assign task");
            return false;
        }
    };

    const getAdminTasks = async () => {
        try {
            dispatch(fetchTasksStart());
            const res = await axiosInstance.get(`${TASK_API_END_POINT}/admin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            dispatch(
                fetchTasksSuccess({
                    tasks: res.data.tasks,
                    count: res.data.counts,
                }),
            );
        } catch (error) {
            dispatch(fetchTasksFailure(error.message));
            toast.error("Failed to fetch tasks");
        }
    };

    const updateAdminTask = async (id, taskData) => {
        try {
            dispatch(updateTaskStart());
            const res = await axiosInstance.put(`${TASK_API_END_POINT}/admin/${id}`, taskData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            dispatch(updateTaskSuccess(res.data.task));
            toast.success("Task updated successfully");
            return true;
        } catch (error) {
            dispatch(updateTaskFailure(error.message));
            toast.error("Failed to update task");
            return false;
        }
    };

    const deleteAdminTask = async (id) => {
        try {
            dispatch(deleteTaskStart());
            await axiosInstance.delete(`${TASK_API_END_POINT}/admin/${id}`, {
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

    const getAllUsers = async () => {
        try {
            const res = await axiosInstance.get(`${TASK_API_END_POINT}/assignuser`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return res.data.users;
        } catch (error) {
            toast.error("Failed to fetch users");
            return [];
        }
    };

    return {
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        createAdminTask,
        getAdminTasks,
        updateAdminTask,
        deleteAdminTask,
        getAllUsers,
    };
};

export default useTask;
