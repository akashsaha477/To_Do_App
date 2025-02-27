import React, { useState } from 'react';
import { Task } from '../types';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Trash2, 
  Edit, 
  Calendar, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  X 
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Partial<Task>) => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleStatusChange = (status: Task['status']) => {
    onUpdate({ status });
  };

  const handlePriorityChange = (priority: Task['priority']) => {
    onUpdate({ priority });
  };

  const handleEdit = () => {
    setEditing(true);
    setEditedTask(task);
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': 
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress': 
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default: 
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${task.status === 'completed' ? 'border-l-4 border-green-500' : task.status === 'in-progress' ? 'border-l-4 border-yellow-500' : 'border-l-4 border-gray-300'}`}>
      {editing ? (
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name="title"
              type="text"
              value={editedTask.title}
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
              value={editedTask.description || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                name="status"
                value={editedTask.status}
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
                value={editedTask.priority}
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
                value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => handleStatusChange(task.status === 'completed' ? 'pending' : 'completed')}
                className="mr-3"
              >
                {getStatusIcon(task.status)}
              </button>
              <div>
                <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center mt-1 space-x-3 text-sm">
                  <span className={`flex items-center ${getPriorityColor(task.priority)}`}>
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  {task.dueDate && (
                    <span className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={onDelete}
                className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100"
              >
                {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {expanded && task.description && (
            <div className="px-4 pb-4 pt-0">
              <div className="mt-2 text-gray-700 border-t pt-3">
                {task.description}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskItem;