import React, { useState } from 'react';
import { useApplications } from '../hooks/useApplications';
import { 
  Plus, 
  X, 
  Edit, 
  Save, 
  Trash2,
  ArrowRight,
  Calendar,
  Clock,
  MessageSquare
} from 'lucide-react';

const AdminStatusManager = ({ application, onStatusUpdate, onClose }) => {
  const { updateApplicationStatus } = useApplications();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get custom rounds from opportunity
  const opportunityRounds = application.opportunity?.rounds || [];
  const [customRounds, setCustomRounds] = useState(opportunityRounds);
  const [newRound, setNewRound] = useState({ name: '', description: '' });

  // Default status flow
  const defaultStatuses = [
    { key: 'APPLIED', label: 'Application Submitted', color: 'blue' },
    { key: 'CUSTOM_ROUND', label: 'Custom Round', color: 'purple' },
    { key: 'PLACED', label: 'Selected', color: 'green' },
    { key: 'REJECTED', label: 'Not Selected', color: 'red' }
  ];

  const handleStatusUpdate = async (newStatus, notes = '', interviewDate = null, interviewTime = null) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(application.id, {
        status: newStatus,
        notes,
        interviewDate,
        interviewTime
      });
      onStatusUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const addCustomRound = () => {
    if (newRound.name.trim()) {
      const round = {
        id: Date.now(),
        name: newRound.name,
        description: newRound.description
      };
      setCustomRounds([...customRounds, round]);
      setNewRound({ name: '', description: '' });
    }
  };

  const removeCustomRound = (id) => {
    setCustomRounds(customRounds.filter(round => round.id !== id));
  };

  const getStatusColor = (status) => {
    const statusObj = defaultStatuses.find(s => s.key === status);
    return statusObj ? statusObj.color : 'gray';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">Manage Application Status</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6">
        {/* Application Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            {application.opportunity.title}
          </h3>
          <p className="text-sm text-gray-600">
            Applicant: {application.student?.user?.profile?.firstName} {application.student?.user?.profile?.lastName}
          </p>
          <p className="text-sm text-gray-600">
            Email: {application.student?.user?.email}
          </p>
          <p className="text-sm text-gray-600">
            Current Status: <span className={`font-medium text-${getStatusColor(application.status)}-600`}>
              {application.status.replace('_', ' ')}
            </span>
          </p>
        </div>

        {/* Custom Rounds Management */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Custom Rounds</h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditing ? 'Done' : 'Edit Rounds'}
            </button>
          </div>

          {isEditing && (
            <div className="mb-4 p-4 border rounded-lg">
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="Round name (e.g., Round 1, HR Interview)"
                  value={newRound.name}
                  onChange={(e) => setNewRound({ ...newRound, name: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newRound.description}
                  onChange={(e) => setNewRound({ ...newRound, description: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={addCustomRound}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {customRounds.map((round) => (
              <div key={round.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{round.name}</span>
                  {round.description && (
                    <p className="text-sm text-gray-600">{round.description}</p>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeCustomRound(round.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status Update Actions */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Update Status</h4>
          
          {/* Default Status Updates */}
          <div className="grid grid-cols-2 gap-3">
            {defaultStatuses.map((status) => (
              <button
                key={status.key}
                onClick={() => handleStatusUpdate(status.key)}
                disabled={application.status === status.key || isUpdating}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                  application.status === status.key
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : `bg-${status.color}-100 text-${status.color}-800 hover:bg-${status.color}-200`
                }`}
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  status.label
                )}
              </button>
            ))}
          </div>

          {/* Custom Round Updates */}
          {customRounds.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Custom Rounds</h5>
              <div className="grid grid-cols-1 gap-2">
                {customRounds.map((round) => (
                  <button
                    key={round.id}
                    onClick={() => handleStatusUpdate(`CUSTOM_${round.id}`, '', null, null, round.name)}
                    disabled={isUpdating}
                    className="p-3 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-800"></div>
                    ) : (
                      round.name
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interview Scheduling */}
          {(application.status === 'TECHNICAL' || application.status === 'INTERVIEW') && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Schedule Interview</h5>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="px-3 py-2 border rounded-lg text-sm"
                  onChange={(e) => {
                    // Handle interview date
                  }}
                />
                <input
                  type="time"
                  className="px-3 py-2 border rounded-lg text-sm"
                  onChange={(e) => {
                    // Handle interview time
                  }}
                />
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <Calendar className="h-4 w-4 mr-1 inline" />
                  Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStatusManager;
