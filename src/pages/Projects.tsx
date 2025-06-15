import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Users, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ProjectForm } from "@/components/ProjectForm";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  const { projects, isLoading, addProject, updateProject, deleteProject } =
    useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    setLoading(true);
    await addProject(projectData);
    setLoading(false);
  };

  const handleEditProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    if (editingProject) {
      setLoading(true);
      await updateProject({ id: editingProject.id, updates: projectData });
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setLoading(true);
    await deleteProject(id);
    setLoading(false);
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">Organize your tasks into projects</p>
          </div>
          <Button
            onClick={openAddForm}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>

        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FolderOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first project.
            </p>
            <Button
              onClick={openAddForm}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="bg-card text-card-foreground backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                      <span>{project.name}</span>
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(project);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {project.description || "No description provided."}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Created:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Updated:{" "}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <ProjectForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={editingProject ? handleEditProject : handleAddProject}
          initialProject={editingProject || undefined}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default Projects;
