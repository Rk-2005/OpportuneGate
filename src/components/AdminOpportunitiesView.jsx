import React, { useState } from 'react';
import { useOpportunities } from '../hooks/useOpportunities';
import { useApplications } from '../hooks/useApplications';
import AdminStatusManager from './AdminStatusManager';
import { 
  Eye, 
  Users, 
  Calendar, 
  MapPin, 
  Building, 
  DollarSign, 
  Clock,
  Briefcase,
  User,
  Mail,
  Phone,
  GraduationCap,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

const AdminOpportunitiesView = () => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isStatusManagerOpen, setIsStatusManagerOpen] = useState(false);

  const { opportunities, isLoading } = useOpportunities({});
  const { updateApplicationStatus, getApplicationsByOpportunity } = useApplications();

  const handleViewApplicants = async (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsLoadingApplicants(true);
    setIsApplicantsModalOpen(true);

    try {
      // Fetch applicants for this opportunity using the hook method
      const data = await getApplicationsByOpportunity(opportunity.id);
      setApplicants(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
      setApplicants([]);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, { status: newStatus });
      // Refresh applicants list
      handleViewApplicants(selectedOpportunity);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleOpenStatusManager = (application) => {
    setSelectedApplication(application);
    setIsStatusManagerOpen(true);
  };

  const handleCloseStatusManager = () => {
    setSelectedApplication(null);
    setIsStatusManagerOpen(false);
  };

  const handleStatusManagerUpdate = () => {
    // Refresh applicants list after status update
    handleViewApplicants(selectedOpportunity);
  };

  const getTypeColor = (type) => {
    const colors = {
      INTERNSHIP: 'bg-blue-100 text-blue-800',
      FULL_TIME: 'bg-green-100 text-green-800',
      CONTEST: 'bg-purple-100 text-purple-800',
      HACKATHON: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      APPLIED: 'bg-blue-100 text-blue-800',
      APTITUDE: 'bg-yellow-100 text-yellow-800',
      TECHNICAL: 'bg-orange-100 text-orange-800',
      INTERVIEW: 'bg-purple-100 text-purple-800',
      PLACED: 'bg-green-100 text-green-800',
      NOT_PLACED: 'bg-red-100 text-red-800',
      REJECTED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Posted Opportunities</h3>
      
      {opportunities.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No opportunities posted yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {opportunity.company?.name || opportunity.college?.name || 'Direct Posting'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Deadline: {format(new Date(opportunity.applicationDeadline), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {opportunity.description}
                  </p>
                </div>
                
                <div className="ml-4 flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleViewApplicants(opportunity)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    View Applicants
                  </button>
                  <span className="text-xs text-gray-500">
                    {opportunity._count?.applications || 0} applications
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicants Modal */}
      {isApplicantsModalOpen && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                Applicants for "{selectedOpportunity.title}"
              </h2>
              <button
                onClick={() => setIsApplicantsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {isLoadingApplicants ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applicants yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {application.student?.profile?.firstName} {application.student?.profile?.lastName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {application.student?.user?.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            {application.student?.profile?.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {application.student.profile.phone}
                              </div>
                            )}
                            {application.student?.profile?.cgpa && (
                              <div className="flex items-center">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                CGPA: {application.student.profile.cgpa}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Applied: {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {application.status.replace('_', ' ')}
                          </span>
                          
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleOpenStatusManager(application)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Manage
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Manager Modal */}
      {isStatusManagerOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <AdminStatusManager
            application={selectedApplication}
            onStatusUpdate={handleStatusManagerUpdate}
            onClose={handleCloseStatusManager}
          />
        </div>
      )}
    </div>
  );
};

export default AdminOpportunitiesView;
