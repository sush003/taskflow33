import { Layout } from "@/components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Plus, Calendar, Edit, Trash2 } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useState } from "react";
import { TaskForm } from "@/components/TaskForm";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    projects,
    isLoading: isLoadingProjects,
    deleteProject,
  } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const {
    tasks,
    isLoading: isLoadingTasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks(projectId);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const { toast } = useToast();

  console.log("ProjectDetail: loadingForm state", loadingForm);

  if (isLoadingProjects) {
    return (
      <Layout>
        <div className="text-center py-12">Loading project details...</div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">Project not found.</div>
      </Layout>
    );
  }

  const handleAddTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    console.log("handleAddTask: started");
    if (!projectId) return;
    setLoadingForm(true);
    try {
      await addTask({ ...taskData, projectId });
      setIsTaskFormOpen(false);
      console.log("handleAddTask: task added successfully");
    } catch (error) {
      toast({
        title: "Error adding task",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
      console.error("handleAddTask: error", error);
    } finally {
      setLoadingForm(false);
      console.log("handleAddTask: finished, loadingForm set to false");
    }
  };

  const handleEditTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    console.log("handleEditTask: started");
    if (editingTask) {
      setLoadingForm(true);
      try {
        await updateTask({ id: editingTask.id, updates: taskData });
        setIsTaskFormOpen(false);
        setEditingTask(null);
        console.log("handleEditTask: task updated successfully");
      } catch (error) {
        toast({
          title: "Error updating task",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        });
        console.error("handleEditTask: error", error);
      } finally {
        setLoadingForm(false);
        console.log("handleEditTask: finished, loadingForm set to false");
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    console.log("handleDeleteTask: started for ID", id);
    setLoadingForm(true);
    try {
      await deleteTask(id);
      console.log("handleDeleteTask: task deleted successfully");
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
      console.error("handleDeleteTask: error", error);
    } finally {
      setLoadingForm(false);
      console.log("handleDeleteTask: finished, loadingForm set to false");
    }
  };

  const handleTaskStatusChange = async (id: string, status: Task["status"]) => {
    console.log("handleTaskStatusChange: started for ID", id, "status", status);
    setLoadingForm(true);
    try {
      await updateTask({ id, updates: { status } });
      console.log("handleTaskStatusChange: status updated successfully");
    } catch (error) {
      toast({
        title: "Error updating task status",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
      console.error("handleTaskStatusChange: error", error);
    } finally {
      setLoadingForm(false);
      console.log("handleTaskStatusChange: finished, loadingForm set to false");
    }
  };

  const openAddTaskForm = () => {
    console.log("openAddTaskForm called");
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const openEditTaskForm = (task: Task) => {
    console.log("openEditTaskForm called for task:", task.id);
    setIsTaskFormOpen(false);
    setTimeout(() => {
      setEditingTask(task);
      setIsTaskFormOpen(true);
      console.log("openEditTaskForm: dialog reopened with editing task");
    }, 0);
  };

  const handleProjectDelete = async () => {
    await deleteProject(project.id);
    navigate("/projects");
    toast({
      title: "Project deleted",
      description: "The project and its associated tasks have been deleted.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.name}
            </h1>
            <p className="text-gray-600">
              {project.description || "No description provided."}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={openAddTaskForm}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task to Project
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your project and all associated tasks.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleProjectDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card text-card-foreground backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5 text-blue-500" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
              {/* Add more project details here if needed */}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-card text-card-foreground backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Tasks in this Project ({tasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTasks ? (
                <p>Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No tasks found for this project. Click "Add Task to Project"
                  to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditTaskForm}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleTaskStatusChange}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        initialTask={editingTask || undefined}
        loading={loadingForm}
      />
    </Layout>
  );
};

export default ProjectDetail;
