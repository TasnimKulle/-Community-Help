import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import supabase from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  FaCheck,
  FaClock,
  FaPlay,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaHandsHelping,
  FaChartBar,
  FaFilter,
  FaSpinner,
  FaTrash,
  FaArrowRight
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Tasks() {
  const { user, profile, loading: authLoading } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user, filter])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('tasks')
        .select(`
          *,
          help_requests (
            *,
            profiles:user_id (full_name, location)
          ),
          assignee:assigned_to (full_name)
        `)
        .order('created_at', { ascending: false })

      // Filter by current user unless admin
      if (profile?.role !== 'admin') {
        query = query.eq('assigned_to', user.id)
      }

      // Apply status filter
      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error

      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskStatus = async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error

      // If task is completed, also update the help request status
      if (newStatus === 'done') {
        const task = tasks.find(t => t.id === taskId)
        if (task?.help_request_id) {
          await supabase
            .from('help_requests')
            .update({ status: 'completed' })
            .eq('id', task.help_request_id)
        }
      }

      toast.success(`Task marked as ${newStatus.replace('_', ' ')}`)
      fetchTasks()
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      toast.success('Task deleted successfully')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleViewDetails = (task) => {
    setSelectedTask(task)
    setShowTaskDetails(true)
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-500" />
      case 'in_progress': return <FaPlay className="text-blue-500" />
      case 'done': return <FaCheck className="text-green-500" />
      default: return <FaClock className="text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'done').length
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view tasks</h2>
          <a href="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your assigned community tasks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaChartBar className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaPlay className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheck className="text-green-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <FaHandsHelping className="text-gray-300 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {filter !== 'all' 
                  ? 'No tasks match the current filter. Try selecting "All Tasks".'
                  : "You don't have any assigned tasks yet. Browse help requests to find tasks you can help with!"
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/help-requests"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Help Requests
                  <FaArrowRight className="ml-2" />
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(task.status)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {task.help_requests?.title || 'Untitled Task'}
                          </h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {task.help_requests?.description || 'No description provided'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                            {task.help_requests?.category && (
                              <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                                {task.help_requests.category}
                              </span>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <FaUser className="mr-1" />
                              <span>{task.help_requests?.profiles?.full_name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaCalendarAlt className="mr-1" />
                              <span>{new Date(task.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleViewDetails(task)}
                        className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                      
                      <div className="flex gap-2">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleTaskStatus(task.id, 'in_progress')}
                            className="flex items-center justify-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                          >
                            <FaPlay className="mr-2" />
                            Start
                          </button>
                        )}
                        
                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => handleTaskStatus(task.id, 'done')}
                            className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <FaCheck className="mr-2" />
                            Complete
                          </button>
                        )}
                        
                        {(profile?.role === 'admin' || task.assigned_to === user.id) && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete task"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Details Modal */}
        {showTaskDetails && selectedTask && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedTask.help_requests?.title}
                    </h3>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedTask.status)}`}>
                        {getStatusIcon(selectedTask.status)}
                        <span className="ml-2">{selectedTask.status.replace('_', ' ')}</span>
                      </span>
                      {selectedTask.help_requests?.category && (
                        <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                          {selectedTask.help_requests.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTaskDetails(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        {selectedTask.help_requests?.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requester</h4>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FaUser className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-gray-900 font-medium">
                            {selectedTask.help_requests?.profiles?.full_name || 'Unknown'}
                          </p>
                          {selectedTask.help_requests?.profiles?.location && (
                            <p className="text-sm text-gray-500">
                              {selectedTask.help_requests.profiles.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Assigned To</h4>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FaUser className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-gray-900 font-medium">
                            {selectedTask.assignee?.full_name || 'You'}
                          </p>
                          <p className="text-sm text-gray-500">Assigned Volunteer</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Created Date</h4>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FaCalendarAlt className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-gray-900 font-medium">
                            {new Date(selectedTask.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedTask.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Task ID</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 font-mono text-sm">
                          {selectedTask.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Status Timeline</h4>
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${selectedTask.status === 'pending' || selectedTask.status === 'in_progress' || selectedTask.status === 'done' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <FaClock />
                      </div>
                      <div className="flex-1 h-1 bg-gray-200"></div>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${selectedTask.status === 'in_progress' || selectedTask.status === 'done' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <FaPlay />
                      </div>
                      <div className="flex-1 h-1 bg-gray-200"></div>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${selectedTask.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <FaCheck />
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">Pending</span>
                      <span className="text-sm text-gray-500">In Progress</span>
                      <span className="text-sm text-gray-500">Completed</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowTaskDetails(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    
                    {selectedTask.status === 'pending' && (
                      <button
                        onClick={() => {
                          handleTaskStatus(selectedTask.id, 'in_progress')
                          setShowTaskDetails(false)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Task
                      </button>
                    )}
                    
                    {selectedTask.status === 'in_progress' && (
                      <button
                        onClick={() => {
                          handleTaskStatus(selectedTask.id, 'done')
                          setShowTaskDetails(false)
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                    
                    {(profile?.role === 'admin' || selectedTask.assigned_to === user.id) && (
                      <button
                        onClick={() => {
                          handleDeleteTask(selectedTask.id)
                          setShowTaskDetails(false)
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete Task
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
