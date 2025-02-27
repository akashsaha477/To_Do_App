import React from 'react';
import { Filter } from 'lucide-react';

interface TaskFilterProps {
  filters: {
    status: string;
    priority: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    status: string;
    priority: string;
  }>>;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filters, setFilters }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-medium">Filter Tasks</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status-filter">
            Status
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="status-filter"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority-filter">
            Priority
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="priority-filter"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;