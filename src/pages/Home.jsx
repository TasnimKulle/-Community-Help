import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHandsHelping,
  FaUsers,
  FaTasks,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Community Help Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with volunteers, offer assistance, and make a difference
              in your community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/help-requests"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <FaHandsHelping className="mr-2" />
                    Browse Help Requests
                  </Link>
                  <Link
                    to="/dashboard"
                    className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Join Now
                  </Link>
                  <Link
                    to="/about"
                    className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaHandsHelping className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Requests</h3>
            <p className="text-gray-600">
              Request help for tasks, projects, or emergencies in your community
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-teal-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Join Organizations</h3>
            <p className="text-gray-600">
              Connect with local organizations and collaborate on community
              projects
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaTasks className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Manage Tasks</h3>
            <p className="text-gray-600">
              Track and manage help requests with our intuitive task management
              system
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaChartLine className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor the impact of community help and track completed tasks
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of volunteers helping their communities every day
            </p>
            <Link
              to={isAuthenticated ? "/help-requests" : "/signup"}
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {isAuthenticated ? "Browse Requests" : "Get Started"}
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
