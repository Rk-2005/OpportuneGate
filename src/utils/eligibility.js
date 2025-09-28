// Utility function to check if a student is eligible for an opportunity
export const checkEligibility = (opportunity, studentProfile) => {
  if (!opportunity.eligibility || !studentProfile) {
    return { isEligible: true, reasons: [] }; // Default to eligible if no criteria
  }

  const eligibility = opportunity.eligibility;
  const reasons = [];

  // Check CGPA
  if (eligibility.minCGPA && studentProfile.cgpa) {
    if (studentProfile.cgpa < eligibility.minCGPA) {
      reasons.push(`Minimum CGPA required: ${eligibility.minCGPA}, Your CGPA: ${studentProfile.cgpa}`);
    }
  }

  // Check SSC Percentage
  if (eligibility.minSSC && studentProfile.sscPercent) {
    if (studentProfile.sscPercent < eligibility.minSSC) {
      reasons.push(`Minimum SSC % required: ${eligibility.minSSC}, Your SSC %: ${studentProfile.sscPercent}`);
    }
  }

  // Check HSC Percentage
  if (eligibility.minHSC && studentProfile.hscPercent) {
    if (studentProfile.hscPercent < eligibility.minHSC) {
      reasons.push(`Minimum HSC % required: ${eligibility.minHSC}, Your HSC %: ${studentProfile.hscPercent}`);
    }
  }

  // Check Year
  if (eligibility.year && studentProfile.currentYear) {
      console.log("hooooo")
        console.log(studentProfile.currentYear)
        console.log((eligibility.year))
    if (studentProfile.currentYear !== Number(eligibility.year)) {
      reasons.push(`Required year: ${eligibility.year}, Your year: ${studentProfile.currentYear}`);
    }
  }

  // Check Branch
  if (eligibility.branch && studentProfile.branch) {
    // Branch can be a string or array
    const requiredBranches = Array.isArray(eligibility.branch) ? eligibility.branch : [eligibility.branch];
    if (!requiredBranches.includes(studentProfile.branch)) {
      reasons.push(`Required branch: ${requiredBranches.join(', ')}, Your branch: ${studentProfile.branch}`);
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons
  };
};

// Get eligibility status for display
export const getEligibilityStatus = (opportunity, studentProfile) => {
  const { isEligible, reasons } = checkEligibility(opportunity, studentProfile);
  
  if (isEligible) {
    return {
      status: 'eligible',
      message: 'You are eligible for this opportunity',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: '✓'
    };
  } else {
    return {
      status: 'not-eligible',
      message: 'You are not eligible for this opportunity',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '✗',
      reasons
    };
  }
};
