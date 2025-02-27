import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { Loader, ListX } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, task: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <ListX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No tasks found. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem 
          key={task._id} 
          task={task} 
          onUpdate={(updatedTask) => onUpdateTask(task._id, updatedTask)}
          onDelete={() => onDeleteTask(task._id)}
        />
      ))}
    </div>
  );
};

export default TaskList;