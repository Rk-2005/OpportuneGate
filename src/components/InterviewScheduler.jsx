import React, { useState } from 'react';
import { useApplications } from '../hooks/useApplications';
import { Calendar, Clock, User, MapPin, Video, Phone } from 'lucide-react';
import { format } from 'date-fns';

const InterviewScheduler = () => {
  const { applications, updateApplicationStatus } = useApplications();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    interviewDate: '',
    interviewTime: '',
    interviewType: 'ONLINE',
    meetingLink: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    setIsSaving(true);
    try {
      await updateApplicationStatus(selectedApplication.id, {
        status: 'INTERVIEW',
        interviewDate: new Date(scheduleData.interviewDate).toISOString(),
        interviewTime: scheduleData.interviewTime,
        notes: scheduleData.notes
      });

      // Reset form
      setScheduleData({
        interviewDate: '',
        interviewTime: '',
        interviewType: 'ONLINE',
        meetingLink: '',
        notes: ''
      });
      setSelectedApplication(null);
      setIsScheduling(false);
    } catch (error) {
      console.error('Failed to schedule interview:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const pendingApplications = applications.filter(app => 
    ['APPLIED', 'APTITUDE', 'TECHNICAL'].includes(app.status)
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Schedule Interviews</h3>
      
      {pendingApplications.length === 0 ? (
        <p className="text-gray-600">No applications ready for interview scheduling.</p>
      ) : (
        <div className="space-y-4">
          {pendingApplications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {application.opportunity.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Student: {application.student?.profile?.firstName} {application.student?.profile?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Company: {application.opportunity.company?.name || application.opportunity.college?.name}
                  </p>
                  <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Applied {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'APTITUDE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedApplication(application);
                    setIsScheduling(true);
                  }}
                  className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interview Scheduling Modal */}
      {isScheduling && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Schedule Interview</h2>
              <button
                onClick={() => setIsScheduling(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  value={scheduleData.interviewDate}
                  onChange={(e) => setScheduleData({...scheduleData, interviewDate: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Time
                </label>
                <input
                  type="time"
                  value={scheduleData.interviewTime}
                  onChange={(e) => setScheduleData({...scheduleData, interviewTime: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Type
                </label>
                <select
                  value={scheduleData.interviewType}
                  onChange={(e) => setScheduleData({...scheduleData, interviewType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="PHONE">Phone</option>
                </select>
              </div>

              {scheduleData.interviewType === 'ONLINE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={scheduleData.meetingLink}
                    onChange={(e) => setScheduleData({...scheduleData, meetingLink: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Any additional notes for the interview..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Interview'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsScheduling(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
