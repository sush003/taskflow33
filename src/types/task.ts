export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  projectId?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}
