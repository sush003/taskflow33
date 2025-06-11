import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  initialTask?: Task;
  loading?: boolean;
}

export const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  loading = false,
}: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    status: initialTask?.status || ("todo" as Task["status"]),
    priority: initialTask?.priority || ("medium" as Task["priority"]),
    dueDate: initialTask?.dueDate
      ? initialTask.dueDate.toISOString().split("T")[0]
      : "",
  });

  // Sync formData with initialTask when it changes
  useEffect(() => {
    setFormData({
      title: initialTask?.title || "",
      description: initialTask?.description || "",
      status: initialTask?.status || "todo",
      priority: initialTask?.priority || "medium",
      dueDate: initialTask?.dueDate
        ? initialTask.dueDate.toISOString().split("T")[0]
        : "",
    });
  }, [initialTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    });
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    });
    onClose();
  };

  // Accessibility: description for dialog
  const descriptionId = "task-form-desc";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={descriptionId}
        className="sm:max-w-md animate-slideIn"
      >
        <span id={descriptionId} className="sr-only">
          {initialTask ? "Edit an existing task." : "Create a new task."}
        </span>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {initialTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter task title"
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter task description"
              rows={3}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) =>
                  setFormData({ ...formData, priority: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialTask ? "Update" : "Create"} Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
