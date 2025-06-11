import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, PlayCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { getTaskStats } = useTasks();
  const stats = getTaskStats();
  const navigate = useNavigate();

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: CheckSquare,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckSquare,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: PlayCircle,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Todo",
      value: stats.todo,
      icon: Clock,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ];

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-card-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your task overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={stat.title}
            className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInUp`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`h-8 w-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card text-card-foreground backdrop-blur-sm border border-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Completion Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-card-foreground">
                  {completionRate}%
                </span>
                <span className="text-sm text-muted-foreground">
                  of tasks completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/tasks")}
                className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-all duration-200 hover:scale-102"
              >
                <div className="font-medium">Create New Task</div>
                <div className="text-sm text-blue-100">
                  Add a new task to your workflow
                </div>
              </button>
              <button
                onClick={() => navigate("/calendar")}
                className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-all duration-200 hover:scale-102"
              >
                <div className="font-medium">View Calendar</div>
                <div className="text-sm text-blue-100">
                  Check your upcoming deadlines
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
