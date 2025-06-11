import { useState } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  PlayCircle,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const statusIcons = {
  todo: Circle,
  'in-progress': PlayCircle,
  completed: CheckCircle,
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-700 border-gray-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
};

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const StatusIcon = statusIcons[task.status];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed';

  return (
    <div
      className={`group bg-card text-card-foreground backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
        isHovered ? 'scale-102' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`h-3 w-3 rounded-full ${priorityColors[task.priority]} animate-pulse`}
            title={`${task.priority} priority`}
          />
          <Badge variant="secondary" className={statusColors[task.status]}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {task.status.replace('-', ' ')}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
        {task.title}
      </h3>
      <p className="text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      <div className="flex items-center justify-between">
        {task.dueDate && (
          <div className={`flex items-center space-x-1 text-xs ${
            isOverdue ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          {task.status !== 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(task.id, task.status === 'todo' ? 'in-progress' : 'completed')}
              className="text-xs animate-fadeIn"
            >
              {task.status === 'todo' ? 'Start' : 'Complete'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
