import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Task, TaskStats } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((task) => ({
        ...task,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
      })) as Task[];
    },
    enabled: !!user,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (
      taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
    ) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.dueDate?.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Task>;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          due_date: updates.dueDate?.toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    addTaskMutation.mutate(taskData);
  };

  const updateTask = (
    id: string,
    updates: Partial<Task>,
    onSuccess?: () => void
  ) => {
    updateTaskMutation.mutate({ id, updates }, { onSuccess });
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const getTaskStats = (): TaskStats => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "completed").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      todo: tasks.filter((t) => t.status === "todo").length,
    };
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    getTaskStats,
  };
};
