import React, { useState } from 'react';
import { Task } from '../types';
import { Save, X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, '_id'>) => void;
  onCancel: () => void;
  initialData?: Partial<Task>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [task, setTask] = useState<Partial<Task>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task as Omit<Task, '_id'>);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Task' : 'Add New Task'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            name="title"
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            placeholder="Task description"
            value={task.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              name="status"
              value={task.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
              Due Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="dueDate"
              name="dueDate"
              type="date"
              value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;