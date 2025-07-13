// AdminAssignTask.js
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { PencilLine, UserCheck, X } from "lucide-react";
import AdminCreateTaskDialog from "./AdminCreateTaskDialog";
import TaskGrid from "@/components/TaskGrid";
import EditTaskSheet from "@/components/EditTaskSheet";
import useTask from "@/hooks/useTask";
import { useSelector } from "react-redux";
import DatePickerField from "@/components/DatePickerField";
import { toast } from "sonner";

const AdminAssignTask = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [users, setUsers] = useState([]);
    const { tasks } = useSelector((state) => state.task);
    const { createAdminTask, getAdminTasks, updateAdminTask, deleteAdminTask, getAllUsers } = useTask();

    useEffect(() => {
        getAdminTasks();
        fetchUsers();
    }, []);

  const fetchUsers = async () => {
    try {
        const response = await getAllUsers();
        if (Array.isArray(response)) {
            setUsers(response);
        } else {
            setUsers([]);
            toast.error("Failed to fetch users");
        }
    } catch (err) {
        setUsers([]);
        toast.error("Error fetching users");
    }
};

    const handleEdit = (task) => {
        setCurrentTask(task);
        setIsSheetOpen(true);
    };

    const handleSave = async (updatedTask) => {
        const success = await updateAdminTask(updatedTask._id, updatedTask);
        if (success) {
            setIsSheetOpen(false);
        }
    };

    const handleDelete = async (taskId) => {
        const success = await deleteAdminTask(taskId);
        if (!success) {
            toast.error("Failed to delete task");
        }
    };

    const handleCreate = async (taskData) => {
        const success = await createAdminTask(taskData);
        if (success) {
            setIsDialogOpen(false);
        }
    };

    const filteredTasks = selectedDate
        ? tasks.filter((task) => {
              const taskDate = new Date(task.startDate).toDateString();
              return taskDate === new Date(selectedDate).toDateString();
          })
        : tasks;

    const handleResetFilters = () => {
        setSelectedDate("");
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-5">
                <div className="flex justify-end">
                    <Button
                        variant="destructive"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <UserCheck className="h-4 w-4" />
                        Assign Task
                    </Button>
                </div>

                <div className="mb-4 flex items-center justify-end gap-2">
                    <DatePickerField
                        name="taskDate"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <Button
                        variant="destructive"
                        onClick={handleResetFilters}
                        disabled={!selectedDate}
                        className="h-10"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only">Reset</span>
                    </Button>
                </div>

                {filteredTasks.length === 0 ? (
                    <div className="mt-6 text-center text-slate-500 dark:text-slate-300">
                        No tasks found for the selected filters.
                    </div>
                ) : (
                    Object.entries(
                        filteredTasks.reduce((acc, task) => {
                            const dateKey = new Date(task.startDate).toDateString();
                            if (!acc[dateKey]) acc[dateKey] = [];
                            acc[dateKey].push(task);
                            return acc;
                        }, {}),
                    ).map(([date, tasksOnDate]) => (
                        <div key={date} className="mb-6 mt-5 w-full border-b pb-4">
                            <h2 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
                                Start Date: {date}
                            </h2>
                            <hr className="mb-3 border-red-500" />
                            <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-1">
                                {tasksOnDate.map((task) => (
                                    <TaskGrid
                                        key={task._id}
                                        tasks={[task]}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isAdmin={true}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}

                <AdminCreateTaskDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onCreate={handleCreate}
                    users={users}
                />

                <EditTaskSheet
                    task={currentTask}
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    onSave={handleSave}
                    isAdmin={true}
                    users={users}
                />
            </div>
        </div>
    );
};

export default AdminAssignTask;