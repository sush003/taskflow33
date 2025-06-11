import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarProvider,
  CalendarHeader,
  CalendarDatePagination,
  CalendarBody,
  CalendarMonthPicker,
  CalendarYearPicker,
  CalendarItem,
} from "@/components/ui/calendar";
import { useTasks } from "@/hooks/useTasks";
import { useMemo, useState } from "react";
import { TaskForm } from "@/components/TaskForm";
import { Task } from "@/types/task";

const PRIORITY_COLORS = {
  low: "#22c55e", // green
  medium: "#f59e42", // orange
  high: "#ef4444", // red
};

const CalendarPage = () => {
  const { tasks, updateTask, addTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  // Map tasks to Feature objects for the calendar, color by priority
  const features = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate)
        .map((task) => ({
          id: task.id,
          name: task.title,
          startAt: task.dueDate,
          endAt: task.dueDate,
          status: {
            id: task.priority,
            name:
              task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
            color: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low,
          },
          _task: task, // pass the original task for editing
        })),
    [tasks]
  );

  const handleCalendarItemClick = (feature: any) => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingTask(feature._task);
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

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    setLoading(false);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">
            View and manage your tasks on the calendar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card text-card-foreground backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarProvider>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex gap-2">
                    <CalendarMonthPicker />
                    <CalendarYearPicker start={2020} end={2100} />
                  </div>
                  <CalendarDatePagination />
                </div>
                <CalendarHeader />
                <CalendarBody features={features}>
                  {({ feature }) => (
                    <div
                      onClick={() => handleCalendarItemClick(feature)}
                      className="cursor-pointer"
                    >
                      <CalendarItem feature={feature} />
                    </div>
                  )}
                </CalendarBody>
              </CalendarProvider>
              <TaskForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                initialTask={editingTask || undefined}
                loading={loading}
              />
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                {tasks
                  .filter((t) => t.dueDate)
                  .sort(
                    (a, b) =>
                      (a.dueDate as Date).getTime() -
                      (b.dueDate as Date).getTime()
                  )
                  .slice(0, 5)
                  .map((task) => (
                    <li key={task.id}>
                      <span className="font-medium">{task.title}</span> —{" "}
                      {task.dueDate?.toLocaleDateString()}
                    </li>
                  ))}
                {tasks.filter((t) => t.dueDate).length === 0 && (
                  <li>No upcoming tasks</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
