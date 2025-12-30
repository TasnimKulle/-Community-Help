import {
  FaChartLine,
  FaGlobe,
  FaHandsHelping,
  FaHeart,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  const team = [
    {
      name: "Tasnim Kulle",
      role: "Founder & CEO",
      bio: "Passionate about community development with 10+ years of experience in social work",
      image:
        "https://images.unsplash.com/photo-1603665696936-1331903666e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzE5fHxwcm9maWxlJTIwcGljdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Fatima Hassan",
      role: "Community Manager",
      bio: "Dedicated to connecting volunteers with those in need across local communities",
      image:
        "https://plus.unsplash.com/premium_photo-1723802616105-fa220fd0991d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHByb2ZpbGUlMjBwaWN0dXJlJTIwZm9yJTIwZ2lybHMlMjBtdXNsaW18ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Omar Mohamed",
      role: "Tech Lead",
      bio: "Building technology solutions to empower communities and facilitate connections",
      image:
        "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
    },
  ];
  const values = [
    {
      icon: <FaHeart className="text-red-500 text-3xl" />,
      title: "Compassion",
      description:
        "We believe in the power of empathy and kindness to transform communities",
    },
    {
      icon: <FaUsers className="text-blue-500 text-3xl" />,
      title: "Community",
      description: "Together we are stronger. We build connections that last",
    },
    {
      icon: <FaShieldAlt className="text-green-500 text-3xl" />,
      title: "Trust & Safety",
      description: "Your safety and privacy are our top priorities",
    },
    {
      icon: <FaChartLine className="text-purple-500 text-3xl" />,
      title: "Impact",
      description: "We measure success by the positive change we create",
    },
    {
      icon: <FaGlobe className="text-teal-500 text-3xl" />,
      title: "Inclusivity",
      description:
        "Everyone is welcome, regardless of background or circumstances",
    },
    {
      icon: <FaHandsHelping className="text-orange-500 text-3xl" />,
      title: "Collaboration",
      description: "We work together to solve problems and help those in need",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Our Mission
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Empowering communities through connection, compassion, and
              collaboration
            </p>
          </div>
        </div>
      </div>
      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center">
          Our mission is to create a platform that connects volunteers with
          individuals and families in need, fostering a spirit of community and
          mutual support. We believe that by working together, we can make a
          meaningful difference in the lives of those around us.
        </p>
      </div>
      {/* Core Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  {value.icon}
                  <h3 className="text-xl font-semibold ml-2">{value.title}</h3>
                </div>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
     
  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-blue-600 font-medium">{member.role}</p>
              <p className="text-gray-700 mt-2">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-lg text-white mb-8 max-w-3xl mx-auto">
            Whether you want to volunteer your time or need assistance, we're
            here to help. Together, we can make a difference.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mr-4"
          >
            Get Involve
          </Link>
        </div>
      </div>
    </div>
  );
};
export default About;
