import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../contexts/AuthContext';
import { User, Phone, GraduationCap, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ProfileCompletionTracker = () => {
  const { user } = useAuth();
  const { profile, completionPercentage, updateProfile, isLoading ,error} = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    sscPercent: '',
    hscPercent: '',
    cgpa: '',
    currentYear: '',
    resume: ''
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        sscPercent: profile.sscPercent || '',
        hscPercent: profile.hscPercent || '',
        cgpa: profile.cgpa || '',
        currentYear: profile.currentYear || '',
        resume: profile.resume || ''
      });
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    updateProfile(formData);
    setIsEditing(false);
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-600';
    if (percentage >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getCompletionIcon = (percentage) => {
    if (percentage >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (percentage >= 70) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getCompletionMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent! Your profile is complete.';
    if (percentage >= 70) return 'Good progress! Complete a few more fields.';
    return 'Please complete your profile to get better opportunities.';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-2 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">
          <h3 className="text-lg font-semibold mb-2">Error Loading Profile</h3>
          <p className="text-sm">{error.message || 'Failed to load profile data'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Profile Completion</h3>
          {getCompletionIcon(completionPercentage)}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${getCompletionColor(completionPercentage)}`}
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">{completionPercentage}% Complete</p>
        <p className="text-sm text-gray-500">{getCompletionMessage(completionPercentage)}</p>
      </div>

      {/* Profile Fields Status */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className={profile?.firstName ? 'text-green-600' : 'text-gray-400'}>
            {profile?.firstName ? '✓ Name' : '○ Name'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4" />
          <span className={profile?.phone ? 'text-green-600' : 'text-gray-400'}>
            {profile?.phone ? '✓ Phone' : '○ Phone'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-4 w-4" />
          <span className={profile?.cgpa ? 'text-green-600' : 'text-gray-400'}>
            {profile?.cgpa ? '✓ CGPA' : '○ CGPA'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span className={profile?.resume ? 'text-green-600' : 'text-gray-400'}>
            {profile?.resume ? '✓ Resume' : '○ Resume'}
          </span>
        </div>
      </div>
      
      {/* Edit Form */}
      {isEditing && (
        <div className="border-t pt-4">
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            Form is now visible! Fill out the fields below.
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SSC Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.sscPercent}
                onChange={(e) => setFormData({...formData, sscPercent: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 85.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HSC Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.hscPercent}
                onChange={(e) => setFormData({...formData, hscPercent: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 78.2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.cgpa}
                onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 8.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
            <select
              value={formData.currentYear}
              onChange={(e) => setFormData({...formData, currentYear: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
            <input
              type="url"
              value={formData.resume}
              onChange={(e) => setFormData({...formData, resume: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionTracker;
