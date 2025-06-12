import { Button } from "@/components/ui/button";
import { PencilLine, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskGrid from "@/components/TaskGrid";
import EditTaskSheet from "@/components/EditTaskSheet";
import useTask from "@/hooks/useTask";
import { useSelector } from "react-redux";
import DatePickerField from "@/components/DatePickerField";

const AssignTask = ({ statusFilter }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const { tasks } = useSelector((state) => state.task);
    const { user } = useSelector((state) => state.auth);
    const { fetchTasks, createTask, updateTask, deleteTask } = useTask();

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleEdit = (task) => {
        setCurrentTask(task);
        setIsSheetOpen(true);
    };

    const handleSave = async (updatedTask) => {
        const success = await updateTask(updatedTask._id, updatedTask);
        if (success) {
            setIsSheetOpen(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (taskId) {
            const success = await deleteTask(taskId);
            if (!success) {
                toast.error("Failed to delete task");
            }
        } else {
            console.error("Task ID is undefined");
            toast.error("Failed to delete task - ID is missing");
        }
    };

    const handleCreate = async (taskData) => {
        const success = await createTask(taskData);
        if (success) {
            setIsDialogOpen(false);
        }
    };

    const normalize = (str) => str.toLowerCase().replace(/\s+/g, "-");

    const filteredTasks = tasks.filter((task) => {
        if (statusFilter === "all") return true;
        return normalize(task.status) === statusFilter;
    });

    // Filter tasks by selected date
    const filteredByDateTasks = selectedDate
        ? filteredTasks.filter((task) => {
              const taskDate = new Date(task.startDate).toDateString();
              return taskDate === new Date(selectedDate).toDateString();
          })
        : filteredTasks;

    const handleResetFilters = () => {
        setSelectedDate("");
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-5">
                {user.role !== "admin" && (
                    <div className="flex justify-end">
                        <Button
                            variant="destructive"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <PencilLine className="mr-2 h-4 w-4" />
                            Create Task
                        </Button>
                    </div>
                )}

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

                {filteredByDateTasks.length === 0 ? (
                    <div className="mt-6 text-center text-slate-500 dark:text-slate-300">No tasks found for the selected filters.</div>
                ) : user.role === "admin" ? (
                    Object.entries(
                        filteredByDateTasks.reduce((acc, task) => {
                            const dateKey = new Date(task.startDate).toDateString();
                            if (!acc[dateKey]) acc[dateKey] = [];
                            acc[dateKey].push(task);
                            return acc;
                        }, {}),
                    ).map(([date, tasksOnDate]) => (
                        <div
                            key={date}
                            className="mb-6 mt-5 w-full border-b pb-4"
                        >
                            <h2 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">Start Date: {date}</h2>
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
                ) : (
                    <TaskGrid
                        tasks={filteredByDateTasks}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isAdmin={false}
                    />
                )}

                <CreateTaskDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onCreate={handleCreate}
                />

                <EditTaskSheet
                    task={currentTask}
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
};

export default AssignTask;
