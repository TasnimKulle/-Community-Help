import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import {
  FaFacebook,
  FaGithub,
  FaHeart,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaArrowUp,
} from "react-icons/fa";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Help Requests", path: "/help-requests" },
    { name: "About", path: "/about" },
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: "252 Community St, Mogadishu, Somalia" },
    { icon: <FaPhone />, text: "+252 61 5620743" },
    { icon: <FaEnvelope />, text: "info@communityhelp.so" },
  ];

  const resources = [
    { name: "Help Center", path: "/help-center" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms-of-service" },
    { name: "Contact Us", path: "/contact" },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: "https://facebook.com", label: "Facebook" },
    { icon: <FaTwitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagram />, url: "https://instagram.com", label: "Instagram" },
    { icon: <FaLinkedin />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaGithub />, url: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <FaHeart className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">CommunityHelp</h2>
                <p className="text-blue-300 text-sm">
                  Connecting Hearts, Building Futures
                </p>
              </div>
            </div>
            <p className="text-gray-300">
              A platform dedicated to connecting volunteers with those in need.
              Together, we can make our communities stronger and more
              supportive.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200 p-2 hover:bg-blue-600 rounded-lg"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-600 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-600 pb-2">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <Link
                    to={resource.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-600 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="text-blue-400 mt-1">{contact.icon}</div>
                  <span className="text-gray-300">{contact.text}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter Subscription */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold mb-3">
                Subscribe to our newsletter
              </h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} CommunityHelp Platform. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <FaArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};