import { FaChartLine, FaGlobe, FaHandsHelping, FaHeart, FaShieldAlt, FaUsers } from "react-icons/fa";

const About = () => {
  const team = [
    {
      name: "Ahmed Ali",
      role: "Founder & CEO",
      bio: "Passionate about community development with 10+ years of experience in social work",
      image:
        "https://chatgpt.com/backend-api/estuary/content?id=file_00000000e63471f498ae3e6dbf3ef5f9&cp=pri&ma=90000&ts=20452&p=igh&cid=1&sig=c4eeb5fe581ed7403225ab824f9298ccfb8903c8e1a18ef88d88116c3eca05e9",
    },
    {
      name: "Fatima Hassan",
      role: "Community Manager",
      bio: "Dedicated to connecting volunteers with those in need across local communities",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
    },
    {
      name: "Omar Mohamed",
      role: "Tech Lead",
      bio: "Building technology solutions to empower communities and facilitate connections",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w-400&h=400&fit=crop",
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
          <h2 className="text-3xl font-bold mb-6 text-center">Our Core Values</h2>
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
      </div>
  );
};
export default About;
