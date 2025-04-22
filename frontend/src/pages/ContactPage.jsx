import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaLinkedin, FaInstagram, FaArrowRight, FaChevronDown } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulated API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const faqItems = [
    {
      question: "How can I place a bulk order?",
      answer: "You can use our bulk buy feature to negotiate directly with farmers. Navigate to the Bulk Buy section, select your products, and start the negotiation process."
    },
    {
      question: "What are the delivery options available?",
      answer: "We offer both direct farm pickup and doorstep delivery options. Delivery charges and timelines vary based on your location and order size."
    },
    {
      question: "How can I become a seller on KrishiMitra?",
      answer: "Farmers can register through our Farmer Dashboard. You'll need to provide basic details, documentation, and complete a brief verification process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including UPI, credit/debit cards, net banking, and cash on delivery for eligible orders."
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-up"
      >
        <div className="inline-block mb-4 p-2 bg-green-100 rounded-full">
          <FaEnvelope className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-brown-800 font-poppins mb-4 tracking-tight">
          Get in Touch with Us
        </h1>
        <p className="text-lg text-brown-600 max-w-3xl mx-auto leading-relaxed">
          We're here to help with anything — from bulk orders to learning queries.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl p-8 border-t-4 border-green-500"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brown-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brown-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-brown-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brown-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-4 bg-green-600 text-white rounded-xl font-medium text-lg 
                  flex items-center justify-center group hover:bg-green-700 transition-all duration-300 transform hover:scale-105
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Message
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 text-center font-medium"
                >
                  Message sent successfully!
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-center font-medium"
                >
                  Failed to send message. Please try again.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Details & Map */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Details Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-8 border-t-4 border-green-500">
              <h3 className="text-2xl font-semibold text-brown-800 mb-6 font-poppins">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FaEnvelope className="text-xl text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-brown-600">Email</p>
                    <a href="mailto:contact@krishimitra.com" className="text-lg text-brown-800 hover:text-green-600 transition-colors">
                      contact@krishimitra.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FaPhone className="text-xl text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-brown-600">Phone</p>
                    <a href="tel:+919876543210" className="text-lg text-brown-800 hover:text-green-600 transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FaMapMarkerAlt className="text-xl text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-brown-600">Address</p>
                    <p className="text-lg text-brown-800">
                      KrishiMitra Office, Tech Park<br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8 pt-6 border-t border-amber-200">
                <h4 className="text-sm font-medium text-brown-600 mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                    <FaWhatsapp className="text-xl" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                    <FaInstagram className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-4 relative overflow-hidden group border-t-4 border-green-500">
              <div className="relative h-64 overflow-hidden rounded-xl">
                <img 
                  src="https://imgs.search.brave.com/ncIOF_ZpbvUf14dLw_7-1kfSiaklO3s2LUVe9q0rO-g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzA0LzU1Lzcx/LzM2MF9GXzIwNDU1/NzE3MV8yNlgwQWFv/dVF3VmxScU90a1B0/d3lwYWgyUXJzNFRJ/eC5qcGc"
                  alt="KrishiMitra Office Location"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-medium">KrishiMitra Headquarters</p>
                    <p className="text-sm text-white/90">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-brown-800 mb-8 text-center font-poppins">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{ backgroundColor: expandedFaq === index ? 'rgb(243, 244, 246)' : 'white' }}
                className="border border-amber-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                >
                  <span className="text-lg font-medium text-brown-800">{item.question}</span>
                  <FaChevronDown 
                    className={`text-brown-400 transition-transform duration-300 ${
                      expandedFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFaq === index ? 'auto' : 0,
                    opacity: expandedFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-brown-600">
                    {item.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage; 