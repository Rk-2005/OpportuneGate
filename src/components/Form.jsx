import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Form() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    message: '',
    
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  const handleGoBack = () => {
    setIsSubmitted(false);
    setFormData({
      firstName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      message: '',
      verification: ''
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            For submitting form our team will contact soon
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const navi=useNavigate();

  return (
    <>
    <Navbar></Navbar>
    
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden flex">
        {/* Left colored section */}
        
        <div className="hidden md:block w-1/4 bg-gradient-to-b from-blue-400 to-blue-600">
        <div className="p-4">
  <a
    onClick={() => {
      navi("/");
    }}
    className="inline-block px-4 py-2 text-2xl bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 cursor-pointer"
  >
 Go Back
  </a>
</div>
</div>
      

        {/* Form section */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Get In Touch</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email id"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Phone Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Phone</label>
              <div className="flex items-center">
                <span className="text-gray-600 font-medium"></span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your Phone No"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Company Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Company</label>
              <input
                type="text"
                name="company"
                placeholder="Enter your Company name"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Position Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                placeholder="Enter your Position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Message Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Message</label>
              <textarea
                name="message"
                placeholder="Type your message here..."
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                required
              />
            </div>

            {/* Verification Code Section */}
          

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Form;