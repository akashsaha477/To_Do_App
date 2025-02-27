import React, { useState, useEffect } from 'react';
import { CheckCircle, ListTodo, PlusCircle, Calendar, Clock, AlertTriangle, Server } from 'lucide-react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import { Task } from './types';
import { fetchTasks, createTask, updateTask, deleteTask, checkServerHealth } from './api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
  });

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      setServerStatus('checking');
      const isHealthy = await checkServerHealth();
      setServerStatus(isHealthy ? 'online' : 'offline');
      
      if (isHealthy) {
        loadTasks();
      } else {
        setError('Cannot connect to the server. Please make sure the backend server is running.');
        setIsLoading(false);
      }
    } catch (err) {
      setServerStatus('offline');
      setError('Failed to check server status. Please make sure the backend server is running.');
      setIsLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load tasks. Please try again later.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (task: Omit<Task, '_id'>) => {
    try {
      setIsLoading(true);
      const newTask = await createTask(task);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add task. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      setIsLoading(true);
      const updated = await updateTask(id, updatedTask);
      setTasks(tasks.map(task => task._id === id ? updated : task));
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update task. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete task. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = () => {
    checkServerConnection();
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filters.status === 'all' || task.status === filters.status;
    const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
    return statusMatch && priorityMatch;
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    
    return { total, completed, pending, inProgress };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ListTodo className="h-10 w-10 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">TaskMaster Pro 2024</h1>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center mr-4 px-3 py-1 rounded-full text-sm ${
                serverStatus === 'online' 
                  ? 'bg-green-100 text-green-800' 
                  : serverStatus === 'offline' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                <Server className="h-4 w-4 mr-1" />
                <span>
                  {serverStatus === 'online' 
                    ? 'Server Online' 
                    : serverStatus === 'offline' 
                      ? 'Server Offline' 
                      : 'Checking Server...'}
                </span>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={serverStatus === 'offline'}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                {showForm ? 'Cancel' : 'Add Task'}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
              {serverStatus === 'offline' && (
                <button 
                  onClick={handleRetryConnection}
                  className="bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm transition-colors"
                >
                  Retry Connection
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <ListTodo className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="mb-6">
          <TaskFilter filters={filters} setFilters={setFilters} />
        </div>

        {serverStatus === 'offline' ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Server className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Server Connection Error</h3>
            <p className="text-gray-600 mb-4">
              Cannot connect to the backend server. Please make sure the server is running by executing:
            </p>
            <div className="bg-gray-100 p-3 rounded text-left mb-4 font-mono text-sm">
              npm run server
            </div>
            <button 
              onClick={handleRetryConnection}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <TaskList 
            tasks={filteredTasks} 
            onUpdateTask={handleUpdateTask} 
            onDeleteTask={handleDeleteTask}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default App;