import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight,
  Calendar,
  User,
  FileText,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

const ApplicationStatusTracker = ({ application }) => {
  // Get custom rounds from opportunity, fallback to default if not available
  const customRounds = application.opportunity?.rounds || [];
  
  // Define the status flow with custom rounds
  const statusFlow = [
    { 
      key: 'APPLIED', 
      label: 'Application Submitted', 
      icon: FileText,
      description: 'Your application has been submitted and is under review'
    },
    // Add custom rounds
    ...customRounds.map((round, index) => ({
      key: `CUSTOM_${round.id}`,
      label: round.name,
      icon: index === customRounds.length - 1 ? CheckCircle : User,
      description: round.description
    })),
    { 
      key: 'PLACED', 
      label: 'Selected', 
      icon: CheckCircle,
      description: 'Congratulations! You have been selected'
    },
    { 
      key: 'REJECTED', 
      label: 'Not Selected', 
      icon: XCircle,
      description: 'Application was not successful this time'
    }
  ];

  const getCurrentStatusIndex = () => {
    return statusFlow.findIndex(status => status.key === application.status);
  };

  const getStatusColor = (status, index) => {
    const currentIndex = getCurrentStatusIndex();
    
    if (status === 'REJECTED') {
      return 'text-red-500';
    }
    
    if (index <= currentIndex) {
      return 'text-green-500';
    }
    
    return 'text-gray-400';
  };

  const getStatusBgColor = (status, index) => {
    const currentIndex = getCurrentStatusIndex();
    
    if (status === 'REJECTED') {
      return 'bg-red-100';
    }
    
    if (index <= currentIndex) {
      return 'bg-green-100';
    }
    
    return 'bg-gray-100';
  };

  const currentIndex = getCurrentStatusIndex();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          application.status === 'PLACED' ? 'bg-green-100 text-green-800' :
          application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {application.status.replace('_', ' ')}
        </span>
      </div>

      {/* Status Timeline */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ 
              width: `${(currentIndex / (statusFlow.length - 1)) * 100}%` 
            }}
          />
        </div>

        {/* Status Steps */}
        <div className="space-y-6">
          {statusFlow.map((status, index) => {
            const Icon = status.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={status.key} className="relative flex items-start">
                {/* Status Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  isActive ? 'border-green-500' : 'border-gray-300'
                } ${getStatusBgColor(status.key, index)}`}>
                  <Icon className={`h-6 w-6 ${getStatusColor(status.key, index)}`} />
                </div>

                {/* Status Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {status.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-xs text-blue-600 font-medium">
                        Current Stage
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm mt-1 ${
                    isActive ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {status.description}
                  </p>

                  {/* Additional Info */}
                  {status.key === 'APPLIED' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Applied on {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                    </p>
                  )}
                  
                  {status.key === 'INTERVIEW' && application.interviewDate && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Interview scheduled for {format(new Date(application.interviewDate), 'MMM dd, yyyy')}
                        {application.interviewTime && ` at ${application.interviewTime}`}
                      </p>
                    </div>
                  )}

                  {status.key === 'PLACED' && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-800">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Congratulations! You have been selected for this position.
                      </p>
                    </div>
                  )}

                  {status.key === 'REJECTED' && (
                    <div className="mt-2 p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-800">
                        <XCircle className="h-3 w-3 inline mr-1" />
                        Application was not successful this time. Keep applying!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      {application.status !== 'PLACED' && application.status !== 'REJECTED' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Next Steps</h4>
          <p className="text-sm text-blue-800">
            {currentIndex < statusFlow.length - 1 ? (
              <>
                <ArrowRight className="h-4 w-4 inline mr-1" />
                Next: {statusFlow[currentIndex + 1].label}
              </>
            ) : (
              'Waiting for final decision from the company.'
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusTracker;
