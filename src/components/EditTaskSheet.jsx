import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

const EditTaskSheet = ({ task, open, onOpenChange, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (task) {
      // Format dates for the date input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        startDate: formatDateForInput(task.startDate),
        endDate: formatDateForInput(task.endDate)
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task) {
      const updatedTask = {
        ...task,
         _id: task._id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate
      };
      onSave(updatedTask);
    }
  };

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Edit Task</SheetTitle>
            <SheetDescription>
              Make changes to your task here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                type="date" 
                id="startDate" 
                name="startDate" 
                value={formData.startDate}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                type="date" 
                id="endDate" 
                name="endDate" 
                value={formData.endDate}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm shadow-sm dark:bg-zinc-900 dark:border-gray-700"
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit">Save changes</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditTaskSheet;