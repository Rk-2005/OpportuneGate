import React, { useState, useEffect } from 'react';
import { useOpportunities } from '../hooks/useOpportunities';
import { useGroups } from '../hooks/useGroups';
import { X, Plus, Calendar, MapPin, DollarSign, Clock, FileText, Users } from 'lucide-react';

const PostOpportunityModal = ({ isOpen, onClose }) => {
  const { createOpportunity, isCreating } = useOpportunities();
  const { getAdminGroups } = useGroups();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'INTERNSHIP',
    location: '',
    salary: '',
    duration: '',
    requirements: [''],
    benefits: [''],
    eligibility: {
      minCGPA: '',
      year: '',
      branch: ''
    },
    rounds: [
      { id: 1, name: 'Aptitude Round', description: 'Aptitude test scheduled', order: 1 },
      { id: 2, name: 'Technical Round', description: 'Technical interview scheduled', order: 2 },
      { id: 3, name: 'Final Interview', description: 'Final interview with HR/Manager', order: 3 },
      { id: 4, name: 'Selected', description: 'Congratulations! You have been selected', order: 4 }
    ],
    applicationDeadline: '',
    groupId: ''
  });

  const { data: groupsData } = getAdminGroups();
  const groups = groupsData?.groups || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleEligibilityChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        [field]: value
      }
    }));
  };

  const addRound = () => {
    const newRound = {
      id: Date.now(),
      name: '',
      description: '',
      order: formData.rounds.length + 1
    };
    setFormData(prev => ({
      ...prev,
      rounds: [...prev.rounds, newRound]
    }));
  };

  const removeRound = (id) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.filter(round => round.id !== id)
    }));
  };

  const updateRound = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.map(round => 
        round.id === id ? { ...round, [field]: value } : round
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty requirements and benefits
    const filteredData = {
      ...formData,
      requirements: formData.requirements.filter(req => req.trim() !== ''),
      benefits: formData.benefits.filter(ben => ben.trim() !== ''),
      applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
      groupId: formData.groupId || ''
    };

    try {
      await createOpportunity(filteredData);
      onClose();
      setFormData({
        title: '',
        description: '',
        type: 'INTERNSHIP',
        location: '',
        salary: '',
        duration: '',
        requirements: [''],
        benefits: [''],
        eligibility: {
          minCGPA: '',
          year: '',
          branch: ''
        },
        rounds: [
          { id: 1, name: 'Aptitude Round', description: 'Aptitude test scheduled', order: 1 },
          { id: 2, name: 'Technical Round', description: 'Technical interview scheduled', order: 2 },
          { id: 3, name: 'Final Interview', description: 'Final interview with HR/Manager', order: 3 },
          { id: 4, name: 'Selected', description: 'Congratulations! You have been selected', order: 4 }
        ],
        applicationDeadline: '',
        groupId: ''
      });
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Post New Opportunity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Software Developer Intern"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="INTERNSHIP">Internship</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="CONTEST">Contest</option>
                <option value="HACKATHON">Hackathon</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe the role, responsibilities, and what the candidate will learn..."
            />
          </div>

          {/* Location and Compensation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Mumbai, Remote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Salary/Stipend
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., ₹25,000/month"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 3 months, 6 months"
              />
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Eligibility Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum CGPA
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.eligibility.minCGPA}
                  onChange={(e) => handleEligibilityChange('minCGPA', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 7.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={formData.eligibility.year}
                  onChange={(e) => handleEligibilityChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Any Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  value={formData.eligibility.branch}
                  onChange={(e) => handleEligibilityChange('branch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., CSE, IT, ECE"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Requirements
            </label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Knowledge of React.js"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="text-green-600 hover:text-green-800 text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Requirement
            </button>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Benefits
            </label>
            {formData.benefits.map((ben, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ben}
                  onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Certificate of completion"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('benefits')}
              className="text-green-600 hover:text-green-800 text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Benefit
            </button>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Application Deadline *
            </label>
            <input
              type="datetime-local"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Target Group (Optional)
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Select a group to send this opportunity only to group members. Leave empty to send to all students.
            </p>
            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Send to all students</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group._count?.members || 0} members)
                </option>
              ))}
            </select>
            {formData.groupId && (
              <p className="text-sm text-blue-600 mt-2">
                This opportunity will only be sent to members of the selected group.
              </p>
            )}
          </div>

          {/* Custom Rounds */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Selection Rounds
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Define the selection process stages for this opportunity
            </p>
            {(formData.rounds || []).map((round, index) => (
              <div key={round.id} className="border rounded-lg p-4 mb-3 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Round {index + 1}
                  </span>
                  {formData.rounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRound(round.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Round Name
                    </label>
                    <input
                      type="text"
                      value={round.name}
                      onChange={(e) => updateRound(round.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="e.g., Aptitude Round, Technical Interview"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={round.description}
                      onChange={(e) => updateRound(round.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="e.g., Aptitude test scheduled"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRound}
              className="text-green-600 hover:text-green-800 text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Round
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                'Post Opportunity'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostOpportunityModal;
