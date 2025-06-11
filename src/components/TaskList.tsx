import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, CheckSquare } from "lucide-react";
import { Task } from "@/types/task";

export const TaskList = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleEdit = (task: Task) => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingTask(task);
      setIsFormOpen(true);
    }, 0);
  };

  const handleFormSubmit = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);
    if (editingTask) {
      await new Promise<void>((resolve) => {
        updateTask(editingTask.id, taskData, () => {
          setEditingTask(null);
          setIsFormOpen(false);
          setLoading(false);
          resolve();
        });
      });
    } else {
      await new Promise<void>((resolve) => {
        addTask(taskData);
        setIsFormOpen(false);
        setLoading(false);
        resolve();
      });
    }
  };

  const handleStatusChange = (id: string, status: Task["status"]) => {
    updateTask(id, { status });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
        <Button
          onClick={() => {
            setIsFormOpen(false);
            setTimeout(() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }, 0);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <CheckSquare className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating your first task"}
          </p>
          {!searchTerm &&
            statusFilter === "all" &&
            priorityFilter === "all" && (
              <Button
                onClick={() => {
                  setIsFormOpen(false);
                  setTimeout(() => {
                    setEditingTask(null);
                    setIsFormOpen(true);
                  }, 0);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first task
              </Button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-slideInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard
                task={task}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onStatusChange={handleStatusChange}
              />
            </div>
          ))}
        </div>
      )}

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialTask={editingTask || undefined}
        loading={loading}
      />
    </div>
  );
};
