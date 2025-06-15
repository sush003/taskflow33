import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

export const useProjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((project) => ({
        ...project,
        createdAt: new Date(project.created_at),
        updatedAt: new Date(project.updated_at),
      })) as Project[];
    },
    enabled: !!user,
  });

  const addProjectMutation = useMutation({
    mutationFn: async (
      projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
    ) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectData.name,
          description: projectData.description,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Project>;
    }) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          name: updates.name,
          description: updates.description,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addProject = addProjectMutation.mutateAsync;
  const updateProject = updateProjectMutation.mutateAsync;
  const deleteProject = deleteProjectMutation.mutateAsync;

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
  };
};
