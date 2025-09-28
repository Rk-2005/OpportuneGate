import React, { useState } from 'react';
import { useApplications } from '../hooks/useApplications';
import { useAuth } from '../contexts/AuthContext';
import { getEligibilityStatus } from '../utils/eligibility';
import UpskillSuggestions from './UpskillSuggestions';
import { 
  X, 
  MapPin, 
  Calendar, 
  Building, 
  DollarSign, 
  Clock,
  Briefcase,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

const OpportunityDetailModal = ({ opportunity, isOpen, onClose }) => {
  const { applications, applyToOpportunity, isApplying } = useApplications();
  const { user } = useAuth();
  const [showUpskill, setShowUpskill] = useState(false);
  
  if (!isOpen || !opportunity) return null;

  const isApplied = applications.some(app => app.opportunityId === opportunity.id);
  const isDeadlinePassed = new Date(opportunity.applicationDeadline) < new Date();
  
  // Check eligibility for students
  const eligibilityStatus = user?.role === 'STUDENT' && user?.profile 
    ? getEligibilityStatus(opportunity, user.profile)
    : { status: 'eligible', message: '', color: '', bgColor: '', icon: '' };

  // Get student skills for skill gap analysis
  const studentSkills = user?.profile?.skills || [];
  const requiredSkills = opportunity.requirements || [];

  const handleApply = () => {
    applyToOpportunity(opportunity.id);
    onClose();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">{opportunity.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center text-lg text-gray-600 mb-2">
                <Building className="h-5 w-5 mr-2" />
                {opportunity.company?.name || opportunity.college?.name || 'Direct Posting'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Posted on {format(new Date(opportunity.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(opportunity.type)}`}>
              {opportunity.type.replace('_', ' ')}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunity.location && (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{opportunity.location}</p>
                </div>
              </div>
            )}

            {opportunity.salary && (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Salary/Stipend</p>
                  <p className="text-sm text-gray-600">{opportunity.salary}</p>
                </div>
              </div>
            )}

            {opportunity.duration && (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">{opportunity.duration}</p>
                </div>
              </div>
            )}

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Application Deadline</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(opportunity.applicationDeadline), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          {opportunity.eligibility && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Eligibility Criteria</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunity.eligibility.minCGPA && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">
                        Minimum CGPA: {opportunity.eligibility.minCGPA}
                      </span>
                    </div>
                  )}
                  {opportunity.eligibility.year && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">
                        Year: {opportunity.eligibility.year}
                      </span>
                    </div>
                  )}
                  {opportunity.eligibility.branch && (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">
                        Branch: {opportunity.eligibility.branch}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Eligibility Status for Students */}
              {user?.role === 'STUDENT' && user?.profile && (
                <div className={`mt-4 p-4 rounded-lg ${eligibilityStatus.bgColor}`}>
                  <div className="flex items-center mb-2">
                    <Shield className={`h-5 w-5 mr-2 ${eligibilityStatus.color}`} />
                    <span className={`font-medium ${eligibilityStatus.color}`}>
                      {eligibilityStatus.message}
                    </span>
                  </div>
                  {eligibilityStatus.reasons && eligibilityStatus.reasons.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Reasons:</p>
                      {eligibilityStatus.reasons.map((reason, index) => (
                        <p key={index} className="text-sm text-gray-600">• {reason}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <div className="space-y-2">
                {opportunity.requirements.map((req, index) => (
                  <div key={index} className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
              
              {/* Skill Gap Analysis for Students */}
              {user?.role === 'STUDENT' && studentSkills.length > 0 && (
                <div className="mt-4">
                  <UpskillSuggestions
                    studentSkills={studentSkills}
                    requiredSkills={requiredSkills}
                    opportunityTitle={opportunity.title}
                    showTitle={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* Benefits */}
          {opportunity.benefits && opportunity.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
              <div className="space-y-2">
                {opportunity.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Status */}
          <div className="pt-4 border-t">
            {isApplied ? (
              <div className="flex items-center justify-center py-3 px-4 bg-green-100 text-green-800 rounded-lg">
                <Briefcase className="h-5 w-5 mr-2" />
                You have already applied to this opportunity
              </div>
            ) : isDeadlinePassed ? (
              <div className="flex items-center justify-center py-3 px-4 bg-gray-100 text-gray-600 rounded-lg">
                <Calendar className="h-5 w-5 mr-2" />
                Application deadline has passed
              </div>
            ) : eligibilityStatus.status === 'not-eligible' ? (
              <div className="flex items-center justify-center py-3 px-4 bg-red-100 text-red-800 rounded-lg">
                <Shield className="h-5 w-5 mr-2" />
                You are not eligible for this opportunity
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isApplying ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Briefcase className="h-5 w-5 mr-2" />
                    Apply Now
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailModal;
