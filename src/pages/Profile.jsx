import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabase";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaHandsHelping,
  FaTasks,
  FaSpinner,
} from "react-icons/fa";

export default function Profile() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
    role: "individual",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        location: profile.location || "",
        role: profile.role || "individual",
      });
      fetchUserStats();
    }
  }, [profile]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [requestsResult, tasksResult] = await Promise.all([
        supabase
          .from("help_requests")
          .select("id, status")
          .eq("user_id", user.id),
        supabase.from("tasks").select("id, status").eq("assigned_to", user.id),
      ]);

      const stats = {
        totalRequests: requestsResult.data?.length || 0,
        completedRequests:
          requestsResult.data?.filter((r) => r.status === "completed").length ||
          0,
        totalTasks: tasksResult.data?.length || 0,
        completedTasks:
          tasksResult.data?.filter((t) => t.status === "done").length || 0,
      };

      setUserStats(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(formData);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Please sign in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account and track your community involvement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    disabled={loading}
                  >
                    {editing ? (
                      <>
                        <FaTimes className="mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <FaEdit className="mr-1" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="individual">
                            Individual Volunteer
                          </option>
                          <option value="admin">Community Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="flex items-center text-gray-900 p-2 bg-gray-50 rounded-lg">
                          <FaUser className="mr-3 text-gray-400" />
                          {profile?.full_name || "Not set"}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center text-gray-900 p-2 bg-gray-50 rounded-lg">
                          <FaEnvelope className="mr-3 text-gray-400" />
                          {user?.email}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="flex items-center text-gray-900 p-2 bg-gray-50 rounded-lg">
                          <FaMapMarkerAlt className="mr-3 text-gray-400" />
                          {profile?.location || "Not set"}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <FaShieldAlt className="mr-3 text-gray-400" />
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              profile?.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {profile?.role === "admin"
                              ? "Community Admin"
                              : "Volunteer"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <div className="flex items-center text-gray-900 p-2 bg-gray-50 rounded-lg">
                          <FaCalendarAlt className="mr-3 text-gray-400" />
                          {profile?.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : "Recently joined"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Stats */}
            {userStats && (
              <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold flex items-center">
                    <FaHandsHelping className="mr-2 text-green-600" />
                    My Community Impact
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {userStats.totalRequests}
                      </div>
                      <div className="text-sm text-gray-600">Help Requests</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {userStats.completedRequests}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {userStats.totalTasks}
                      </div>
                      <div className="text-sm text-gray-600">
                        Tasks Assigned
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600 mb-1">
                        {userStats.completedTasks}
                      </div>
                      <div className="text-sm text-gray-600">Tasks Done</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Account Info */}
          <div className="space-y-8">
            {/* Account Status */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Email Verified</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user?.email_confirmed_at
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user?.email_confirmed_at ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium">
                    {profile?.role === "admin" ? "Admin" : "Standard"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/help-requests"
                  className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaHandsHelping className="mr-3" />
                  Browse Help Requests
                </a>
                <a
                  href="/tasks"
                  className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FaTasks className="mr-3" />
                  View My Tasks
                </a>
                <a
                  href="/dashboard"
                  className="flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4">Security</h3>
              <div className="space-y-4">
                <button
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    toast.info("Password change feature coming soon!")
                  }
                >
                  <div className="font-medium">Change Password</div>
                  <div className="text-sm text-gray-500">
                    Update your password regularly
                  </div>
                </button>
                <button
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    toast.info("Two-factor authentication coming soon!")
                  }
                >
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">
                    Add an extra layer of security
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
