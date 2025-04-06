import React from 'react';
import { FaLeaf, FaHandshake, FaTruck, FaUsers } from 'react-icons/fa';

const AboutPage = () => {
  const features = [
    {
      id: 'direct-sourcing',
      icon: <FaLeaf className="h-6 w-6 text-primary-color" />,
      title: 'Direct Farm Sourcing',
      description: 'We connect you directly with local farmers, ensuring fresh produce and fair prices.'
    },
    {
      id: 'fair-trade',
      icon: <FaHandshake className="h-6 w-6 text-primary-color" />,
      title: 'Fair Trade Practices',
      description: 'Supporting sustainable farming through fair pricing and transparent transactions.'
    },
    {
      id: 'delivery',
      icon: <FaTruck className="h-6 w-6 text-primary-color" />,
      title: 'Quick Delivery',
      description: 'Fast and reliable delivery service to bring fresh produce right to your doorstep.'
    },
    {
      id: 'community',
      icon: <FaUsers className="h-6 w-6 text-primary-color" />,
      title: 'Community Support',
      description: 'Building a strong community of farmers and consumers for sustainable agriculture.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About KrishiMitra
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering farmers and consumers through direct farm-to-table connections,
            promoting sustainable agriculture and fair trade practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Our Mission
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto">
            At KrishiMitra, we're committed to revolutionizing the agricultural marketplace
            by creating a direct bridge between farmers and consumers. Our platform
            ensures fair prices for farmers while providing consumers with access to
            fresh, high-quality produce at reasonable prices.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-primary-color rounded-xl shadow-sm p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-6">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <a
            href="mailto:contact@krishimitra.com"
            className="inline-block bg-white text-primary-color px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 