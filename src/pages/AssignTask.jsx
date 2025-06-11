import { Button } from "@/components/ui/button";
import { taskData } from "@/utils/data";
import { PencilLine, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskGrid from "@/components/TaskGrid";
import EditTaskSheet from "@/components/EditTaskSheet";
import useTask from "@/hooks/useTask";
import { useSelector } from "react-redux";

const AssignTask = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const { tasks, loading } = useSelector((state) => state.task);
  const { role } = useSelector((state) => state.auth);
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

    return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => setIsDialogOpen(true)}
          >
            <PencilLine className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>

        {loading ? (
          <div>Loading tasks...</div>
        ) : (
          <TaskGrid
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={role === "admin"}
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
