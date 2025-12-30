import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaClock,
  FaChartBar,
  FaUsers,
  FaHandsHelping,
} from "react-icons/fa";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [helpRequests, setHelpRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    category: "",
    request_type: "individual",
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user's help requests
      const { data: requests } = await supabase
        .from("help_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch user's tasks
      const { data: userTasks } = await supabase
        .from("tasks")
        .select("*, help_requests(*)")
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false });

      setHelpRequests(requests || []);
      setTasks(userTasks || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("help_requests").insert([
        {
          ...newRequest,
          user_id: user.id,
          status: "open",
        },
      ]);

      if (error) throw error;

      toast.success("Help request created successfully");
      setShowCreateForm(false);
      setNewRequest({
        title: "",
        description: "",
        category: "",
        request_type: "individual",
      });
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to create help request");
      console.error(error);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      const { error } = await supabase
        .from("help_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Help request deleted");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to delete help request");
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Task status updated");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = {
    totalRequests: helpRequests.length,
    pendingTasks: tasks.filter((t) => t.status === "pending").length,
    completedTasks: tasks.filter((t) => t.status === "done").length,
    openRequests: helpRequests.filter((r) => r.status === "open").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {profile?.full_name || "User"}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaHandsHelping className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-2xl font-bold">{stats.totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Tasks</p>
                <p className="text-2xl font-bold">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheck className="text-green-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{stats.completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaChartBar className="text-purple-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Open Requests</p>
                <p className="text-2xl font-bold">{stats.openRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Request Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Create New Help Request
          </button>
        </div>

        {/* Create Request Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">New Help Request</h2>
            <form onSubmit={handleCreateRequest}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRequest.title}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What help do you need?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newRequest.category}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="food">Food Assistance</option>
                    <option value="shelter">Shelter</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={newRequest.description}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Describe what help you need..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Help Requests Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Help Requests */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold flex items-center">
                <FaHandsHelping className="mr-2 text-blue-600" />
                My Help Requests
              </h2>
            </div>
            <div className="p-6">
              {helpRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  You haven't created any help requests yet
                </p>
              ) : (
                <div className="space-y-4">
                  {helpRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{request.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {request.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                request.status === "open"
                                  ? "bg-green-100 text-green-800"
                                  : request.status === "in_progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {request.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                request.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Tasks */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold flex items-center">
                <FaTasks className="mr-2 text-green-600" />
                My Assigned Tasks
              </h2>
            </div>
            <div className="p-6">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tasks assigned to you yet
                </p>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {task.help_requests?.title || "Untitled Task"}
                          </h3>
                          <div className="flex items-center mt-2 space-x-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                task.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : task.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {task.status}
                            </span>
                            <div className="space-x-2">
                              {task.status !== "done" && (
                                <button
                                  onClick={() =>
                                    handleUpdateTaskStatus(
                                      task.id,
                                      task.status === "pending"
                                        ? "in_progress"
                                        : "done"
                                    )
                                  }
                                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  {task.status === "pending"
                                    ? "Start"
                                    : "Complete"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
