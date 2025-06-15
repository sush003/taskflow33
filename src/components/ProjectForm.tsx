import React, { useState, useEffect } from "react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
  ) => Promise<void>;
  initialProject?: Project;
  loading: boolean;
}

export const ProjectForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialProject,
  loading,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState<
    Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
  >({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialProject) {
      setFormData({
        name: initialProject.name,
        description: initialProject.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [initialProject, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialProject ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {initialProject
              ? "Make changes to your project here. Click save when you're done."
              : "Fill in the details for your new project."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialProject ? "Save changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
