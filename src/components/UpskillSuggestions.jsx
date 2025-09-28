import React, { useState } from 'react';
import { BookOpen, Clock, Star, ExternalLink, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getCourseSuggestions, analyzeSkillGap } from '../utils/skillGapAnalysis';

const UpskillSuggestions = ({ 
  studentSkills = [], 
  requiredSkills = [], 
  opportunityTitle,
  onClose,
  showTitle = true 
}) => {
  const [expandedCourse, setExpandedCourse] = useState(null);
  
  const skillGap = analyzeSkillGap(studentSkills, requiredSkills);
  const courseSuggestions = getCourseSuggestions(skillGap.missingSkills);
  
  if (!skillGap.hasGap) {
    return null;
  }

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriceColor = (price) => {
    return price === 'Free' ? 'text-green-600' : 'text-blue-600';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Skill Gap Detected
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          You're missing <span className="font-semibold text-orange-600">
            {skillGap.missingSkills.length} out of {requiredSkills.length}
          </span> required skills for this opportunity.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {skillGap.missingSkills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          <span>You have {skillGap.presentSkills.length} matching skills</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
          Recommended Courses to Bridge the Gap
        </h4>

        {courseSuggestions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No specific courses found for the missing skills. Consider general programming courses.
          </p>
        ) : (
          <div className="space-y-3">
            {courseSuggestions.map((course) => (
              <div
                key={course.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{course.title}</h5>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">{course.provider}</span>
                      </div>
                      <div className={`font-medium ${getPriceColor(course.price)}`}>
                        {course.price}
                      </div>
                    </div>

                    {expandedCourse === course.id && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills you'll learn:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => setExpandedCourse(
                        expandedCourse === course.id ? null : course.id
                      )}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    >
                      {expandedCourse === course.id ? 'Less Details' : 'More Details'}
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Pro Tip:</strong> Completing these courses will increase your eligibility 
          for similar opportunities by {100 - skillGap.gapPercentage}%.
        </p>
      </div>
    </div>
  );
};

export default UpskillSuggestions;
