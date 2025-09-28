import React, { useState } from 'react';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useApplications } from '../../hooks/useApplications';
import { useAuth } from '../../contexts/AuthContext';
import OpportunityDetailModal from '../../components/OpportunityDetailModal';
import UpskillSuggestions from '../../components/UpskillSuggestions';
import { getEligibilityStatus } from '../../utils/eligibility';
import { analyzeSkillGap } from '../../utils/skillGapAnalysis';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Building, 
  DollarSign, 
  Clock,
  Briefcase,
  Users,
  ArrowRight,
  Eye,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

const Opportunities = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    type: '',
    company: '',
    page: 1,
    limit: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { opportunities, isLoading } = useOpportunities(filters);
  const { applications, applyToOpportunity, isApplying } = useApplications();
  
  // Get student skills for skill gap analysis
  const studentSkills = user?.profile?.skills || [];

  // Get applied opportunity IDs
  const appliedOpportunityIds = applications.map(app => app.opportunityId);

  const handleApply = (opportunityId) => {
    applyToOpportunity(opportunityId);
  };

  const handleViewDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDetailModalOpen(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const filteredOpportunities = opportunities.filter(opportunity => {
    if (!searchTerm) return true;
    return opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           opportunity.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getTypeColor = (type) => {
    const colors = {
      INTERNSHIP: 'bg-blue-100 text-blue-800',
      FULL_TIME: 'bg-green-100 text-green-800',
      CONTEST: 'bg-purple-100 text-purple-800',
      HACKATHON: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Opportunities</h1>
          <p className="text-gray-600">Discover internships, jobs, and contests that match your profile</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="CONTEST">Contest</option>
                <option value="HACKATHON">Hackathon</option>
              </select>

              <input
                type="text"
                placeholder="Company"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => {
            const isApplied = appliedOpportunityIds.includes(opportunity.id);
            const isDeadlinePassed = new Date(opportunity.applicationDeadline) < new Date();
            const eligibilityStatus = getEligibilityStatus(opportunity, user?.profile);

            return (
              <div key={opportunity.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(opportunity)}>
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {opportunity.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        {opportunity.company?.name || opportunity.college?.name || 'Direct Posting'}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                        {opportunity.type.replace('_', ' ')}
                      </span>
                      {eligibilityStatus.status === 'not-eligible' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          Not Eligible
                        </span>
                      )}
                      {eligibilityStatus.status === 'eligible' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          Eligible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>

                  {/* Skill Gap Analysis */}
                  {studentSkills.length > 0 && opportunity.requirements && opportunity.requirements.length > 0 && (
                    (() => {
                      const skillGap = analyzeSkillGap(studentSkills, opportunity.requirements);
                      return skillGap.hasGap ? (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-orange-500 mr-2" />
                              <span className="text-sm font-medium text-orange-800">
                                Missing {skillGap.missingSkills.length} required skills
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedOpportunity(opportunity)}
                              className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                            >
                              Upskill Now →
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {skillGap.missingSkills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {skillGap.missingSkills.length > 3 && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                                +{skillGap.missingSkills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      ) : null;
                    })()
                  )}

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {opportunity.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {opportunity.location}
                      </div>
                    )}
                    
                    {opportunity.salary && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {opportunity.salary}
                      </div>
                    )}

                    {opportunity.duration && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {opportunity.duration}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Deadline: {format(new Date(opportunity.applicationDeadline), 'MMM dd, yyyy')}
                    </div>
                  </div>

                  {/* Requirements */}
                  {opportunity.requirements && opportunity.requirements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.requirements.slice(0, 3).map((req, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {req}
                          </span>
                        ))}
                        {opportunity.requirements.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{opportunity.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(opportunity);
                        }}
                        className="flex-1 flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      {!isApplied && !isDeadlinePassed && eligibilityStatus.status === 'eligible' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(opportunity.id);
                          }}
                          disabled={isApplying}
                          className="flex-1 flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isApplying ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              Apply
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </button>
                      )}
                      {!isApplied && !isDeadlinePassed && eligibilityStatus.status === 'not-eligible' && (
                        <button
                          disabled
                          className="flex-1 flex items-center justify-center py-2 px-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Not Eligible
                        </button>
                      )}
                    </div>
                    {isApplied && (
                      <div className="mt-2 flex items-center justify-center py-2 px-4 bg-green-100 text-green-800 rounded-lg">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Applied
                      </div>
                    )}
                    {isDeadlinePassed && (
                      <div className="mt-2 flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Deadline Passed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        )}

        {/* Opportunity Detail Modal */}
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedOpportunity(null);
          }}
        />
      </div>
    </div>
  );
};

export default Opportunities;
