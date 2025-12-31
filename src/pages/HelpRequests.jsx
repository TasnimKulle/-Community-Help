import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabase";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaHandsHelping,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEye,
  FaTasks,
  FaPlus,
  FaSpinner,
  FaCheck,
  FaClock,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

export default function HelpRequests() {
  const { user, profile, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    category: "",
    request_type: "individual",
  });

  useEffect(() => {
    if (user) {
      fetchHelpRequests();
    }
  }, [user]);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, filter]);

  const fetchHelpRequests = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("help_requests")
        .select(
          `
          *,
          profiles:user_id(full_name, location),
          organizations:organization_id(name, contact_email)
        `
        )
        .order("created_at", { ascending: false });

      // Show all requests to authenticated users
      const { data, error } = await query;

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching help requests:", error);
      toast.error("Failed to load help requests");
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(term) ||
          request.description?.toLowerCase().includes(term) ||
          request.category?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((request) => request.status === filter);
    }

    setFilteredRequests(filtered);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...newRequest,
        user_id: user.id,
        status: "open",
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("help_requests")
        .insert([requestData]);

      if (error) throw error;

      toast.success("Help request created successfully!");
      setShowCreateForm(false);
      setNewRequest({
        title: "",
        description: "",
        category: "",
        request_type: "individual",
      });
      fetchHelpRequests();
    } catch (error) {
      toast.error("Failed to create help request");
      console.error(error);
    }
  };

  const handleEditRequest = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("help_requests")
        .update({
          title: editingRequest.title,
          description: editingRequest.description,
          category: editingRequest.category,
          request_type: editingRequest.request_type,
        })
        .eq("id", editingRequest.id);

      if (error) throw error;

      toast.success("Help request updated successfully!");
      setShowEditForm(false);
      setEditingRequest(null);
      fetchHelpRequests();
    } catch (error) {
      toast.error("Failed to update help request");
      console.error(error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      const { error } = await supabase
        .from("help_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Help request deleted successfully!");
      fetchHelpRequests();
    } catch (error) {
      toast.error("Failed to delete help request");
      console.error(error);
    }
  };

  const handleTakeTask = async (requestId) => {
    try {
      // Create a task for this request
      const { error } = await supabase.from("tasks").insert([
        {
          help_request_id: requestId,
          assigned_to: user.id,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Update request status
      await supabase
        .from("help_requests")
        .update({ status: "in_progress" })
        .eq("id", requestId);

      toast.success(
        "Task assigned successfully! You can now work on it from your Tasks page."
      );
      fetchHelpRequests();
    } catch (error) {
      toast.error("Failed to assign task");
      console.error(error);
    }
  };

  const handleRequestStatus = async (requestId, newStatus) => {
    try {
      const { error } = await supabase
        .from("help_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (error) throw error;

      toast.success(`Request marked as ${newStatus}`);
      fetchHelpRequests();
    } catch (error) {
      toast.error("Failed to update request status");
    }
  };

  const startEditRequest = (request) => {
    setEditingRequest(request);
    setShowEditForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "education":
        return "bg-purple-100 text-purple-800";
      case "health":
        return "bg-red-100 text-red-800";
      case "food":
        return "bg-yellow-100 text-yellow-800";
      case "shelter":
        return "bg-indigo-100 text-indigo-800";
      case "transportation":
        return "bg-teal-100 text-teal-800";
      case "clothing":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <FaClock className="text-green-500" />;
      case "in_progress":
        return <FaTasks className="text-blue-500" />;
      case "completed":
        return <FaCheck className="text-gray-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading help requests...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view help requests
          </h2>
          <a
            href="/signin"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Help Requests
              </h1>
              <p className="text-gray-600 mt-2">
                Browse and respond to help requests from the community
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <FaPlus className="mr-2" />
              Create Request
            </button>
          </div>
        </div>

        {/* Create Request Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-slide-down">
            <h2 className="text-xl font-bold mb-4">Create New Help Request</h2>
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
                    Category *
                  </label>
                  <select
                    required
                    value={newRequest.category}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="education">Education</option>
                    <option value="health">Health & Medical</option>
                    <option value="food">Food Assistance</option>
                    <option value="shelter">Shelter & Housing</option>
                    <option value="transportation">Transportation</option>
                    <option value="clothing">Clothing</option>
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
                  placeholder="Describe what help you need, when you need it, and any specific requirements..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="individual"
                      checked={newRequest.request_type === "individual"}
                      onChange={(e) =>
                        setNewRequest({
                          ...newRequest,
                          request_type: e.target.value,
                        })
                      }
                      className="mr-2"
                    />
                    <span>Individual</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="organization"
                      checked={newRequest.request_type === "organization"}
                      onChange={(e) =>
                        setNewRequest({
                          ...newRequest,
                          request_type: e.target.value,
                        })
                      }
                      className="mr-2"
                    />
                    <span>Organization</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Request Form */}
        {showEditForm && editingRequest && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-slide-down">
            <h2 className="text-xl font-bold mb-4">Edit Help Request</h2>
            <form onSubmit={handleEditRequest}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRequest.title}
                    onChange={(e) =>
                      setEditingRequest({
                        ...editingRequest,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={editingRequest.category}
                    onChange={(e) =>
                      setEditingRequest({
                        ...editingRequest,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="education">Education</option>
                    <option value="health">Health & Medical</option>
                    <option value="food">Food Assistance</option>
                    <option value="shelter">Shelter & Housing</option>
                    <option value="transportation">Transportation</option>
                    <option value="clothing">Clothing</option>
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
                  value={editingRequest.description}
                  onChange={(e) =>
                    setEditingRequest({
                      ...editingRequest,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingRequest(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <FaHandsHelping className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No help requests found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to create a help request!"}
            </p>
            {!searchTerm && filter === "all" && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create your first request
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            <span className="ml-1">
                              {request.status.replace("_", " ")}
                            </span>
                          </span>
                          {request.category && (
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                                request.category
                              )}`}
                            >
                              {request.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {request.request_type === "individual" ? (
                          <FaUser className="text-blue-600 ml-2" />
                        ) : (
                          <FaBuilding className="text-green-600 ml-2" />
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {request.description || "No description provided"}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUser className="mr-2" />
                        <span>
                          {request.profiles?.full_name || "Unknown User"}
                        </span>
                      </div>
                      {request.profiles?.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{request.profiles.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        <span>
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTakeTask(request.id)}
                          disabled={
                            request.status !== "open" ||
                            request.user_id === user.id
                          }
                          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                            request.status !== "open" ||
                            request.user_id === user.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          <FaTasks className="mr-2" />
                          {request.user_id === user.id
                            ? "Your Request"
                            : "Take Task"}
                        </button>
                      </div>

                      <div className="flex space-x-2">
                        {request.user_id === user.id && (
                          <>
                            <button
                              onClick={() => startEditRequest(request)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit request"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(request.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete request"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}

                        {(profile?.role === "admin" ||
                          request.user_id === user.id) &&
                          request.status !== "completed" && (
                            <button
                              onClick={() =>
                                handleRequestStatus(request.id, "completed")
                              }
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                            >
                              Mark Complete
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow p-4">
                <div className="text-sm text-gray-500">Total Requests</div>
                <div className="text-2xl font-bold">{requests.length}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <div className="text-sm text-gray-500">Open Requests</div>
                <div className="text-2xl font-bold text-green-600">
                  {requests.filter((r) => r.status === "open").length}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="text-2xl font-bold text-blue-600">
                  {requests.filter((r) => r.status === "in_progress").length}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <div className="text-sm text-gray-500">Completed</div>
                <div className="text-2xl font-bold text-gray-600">
                  {requests.filter((r) => r.status === "completed").length}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
