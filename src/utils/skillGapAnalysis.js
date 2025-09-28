// Dummy course data for skill suggestions
export const COURSE_CATALOG = {
  'JavaScript': [
    {
      id: 'js-basics',
      title: 'JavaScript Fundamentals',
      provider: 'Coursera',
      duration: '4 weeks',
      level: 'Beginner',
      rating: 4.8,
      price: 'Free',
      description: 'Master the fundamentals of JavaScript programming',
      skills: ['JavaScript', 'ES6', 'DOM Manipulation', 'Async Programming']
    },
    {
      id: 'js-advanced',
      title: 'Advanced JavaScript Concepts',
      provider: 'Udemy',
      duration: '6 weeks',
      level: 'Intermediate',
      rating: 4.9,
      price: '$49.99',
      description: 'Deep dive into advanced JavaScript patterns and concepts',
      skills: ['JavaScript', 'Closures', 'Prototypes', 'Design Patterns']
    }
  ],
  'React': [
    {
      id: 'react-basics',
      title: 'React for Beginners',
      provider: 'freeCodeCamp',
      duration: '5 weeks',
      level: 'Beginner',
      rating: 4.7,
      price: 'Free',
      description: 'Learn React from scratch with hands-on projects',
      skills: ['React', 'JSX', 'Components', 'State Management']
    },
    {
      id: 'react-advanced',
      title: 'Complete React Developer Course',
      provider: 'Udemy',
      duration: '8 weeks',
      level: 'Intermediate',
      rating: 4.8,
      price: '$89.99',
      description: 'Master React with hooks, context, and advanced patterns',
      skills: ['React', 'Hooks', 'Context API', 'Redux', 'Testing']
    }
  ],
  'Node.js': [
    {
      id: 'node-basics',
      title: 'Node.js Fundamentals',
      provider: 'Pluralsight',
      duration: '3 weeks',
      level: 'Beginner',
      rating: 4.6,
      price: 'Free',
      description: 'Learn server-side JavaScript with Node.js',
      skills: ['Node.js', 'Express', 'NPM', 'REST APIs']
    },
    {
      id: 'node-advanced',
      title: 'Advanced Node.js Development',
      provider: 'LinkedIn Learning',
      duration: '6 weeks',
      level: 'Intermediate',
      rating: 4.7,
      price: '$39.99',
      description: 'Build scalable applications with Node.js',
      skills: ['Node.js', 'Microservices', 'Authentication', 'Database Integration']
    }
  ],
  'Python': [
    {
      id: 'python-basics',
      title: 'Python for Everybody',
      provider: 'Coursera',
      duration: '4 weeks',
      level: 'Beginner',
      rating: 4.8,
      price: 'Free',
      description: 'Complete Python programming course',
      skills: ['Python', 'Data Structures', 'OOP', 'File Handling']
    },
    {
      id: 'python-advanced',
      title: 'Advanced Python Programming',
      provider: 'edX',
      duration: '8 weeks',
      level: 'Intermediate',
      rating: 4.7,
      price: '$99.99',
      description: 'Master advanced Python concepts and frameworks',
      skills: ['Python', 'Django', 'Flask', 'Data Science', 'Machine Learning']
    }
  ],
  'Java': [
    {
      id: 'java-basics',
      title: 'Java Programming Basics',
      provider: 'Oracle University',
      duration: '5 weeks',
      level: 'Beginner',
      rating: 4.5,
      price: 'Free',
      description: 'Learn Java programming fundamentals',
      skills: ['Java', 'OOP', 'Collections', 'Exception Handling']
    },
    {
      id: 'java-spring',
      title: 'Java Spring Framework',
      provider: 'Udemy',
      duration: '7 weeks',
      level: 'Intermediate',
      rating: 4.8,
      price: '$79.99',
      description: 'Master Spring framework for enterprise applications',
      skills: ['Java', 'Spring Boot', 'Spring Security', 'Microservices']
    }
  ],
  'SQL': [
    {
      id: 'sql-basics',
      title: 'SQL Fundamentals',
      provider: 'Khan Academy',
      duration: '3 weeks',
      level: 'Beginner',
      rating: 4.6,
      price: 'Free',
      description: 'Learn SQL database querying',
      skills: ['SQL', 'Database Design', 'Query Optimization', 'Joins']
    }
  ],
  'MongoDB': [
    {
      id: 'mongodb-basics',
      title: 'MongoDB for Developers',
      provider: 'MongoDB University',
      duration: '4 weeks',
      level: 'Beginner',
      rating: 4.7,
      price: 'Free',
      description: 'Learn NoSQL database with MongoDB',
      skills: ['MongoDB', 'NoSQL', 'Database Design', 'Aggregation']
    }
  ],
  'AWS': [
    {
      id: 'aws-basics',
      title: 'AWS Cloud Practitioner',
      provider: 'AWS Training',
      duration: '6 weeks',
      level: 'Beginner',
      rating: 4.8,
      price: 'Free',
      description: 'Learn AWS cloud fundamentals',
      skills: ['AWS', 'Cloud Computing', 'EC2', 'S3', 'Lambda']
    }
  ],
  'Docker': [
    {
      id: 'docker-basics',
      title: 'Docker for Developers',
      provider: 'Docker Inc',
      duration: '2 weeks',
      level: 'Beginner',
      rating: 4.6,
      price: 'Free',
      description: 'Learn containerization with Docker',
      skills: ['Docker', 'Containers', 'Docker Compose', 'DevOps']
    }
  ],
  'Git': [
    {
      id: 'git-basics',
      title: 'Git and GitHub for Beginners',
      provider: 'GitHub',
      duration: '2 weeks',
      level: 'Beginner',
      rating: 4.7,
      price: 'Free',
      description: 'Master version control with Git',
      skills: ['Git', 'GitHub', 'Version Control', 'Collaboration']
    }
  ]
};

// Analyze skill gap between student profile and opportunity requirements
export const analyzeSkillGap = (studentSkills = [], requiredSkills = []) => {
  const studentSkillsLower = studentSkills.map(skill => skill.toLowerCase().trim());
  const requiredSkillsLower = requiredSkills.map(skill => skill.toLowerCase().trim());
  
  const missingSkills = requiredSkillsLower.filter(skill => 
    !studentSkillsLower.some(studentSkill => 
      studentSkill.includes(skill) || skill.includes(studentSkill)
    )
  );
  
  const presentSkills = requiredSkillsLower.filter(skill =>
    studentSkillsLower.some(studentSkill => 
      studentSkill.includes(skill) || skill.includes(studentSkill)
    )
  );
  
  return {
    missingSkills: missingSkills.map(skill => 
      requiredSkills.find(originalSkill => 
        originalSkill.toLowerCase().trim() === skill
      )
    ),
    presentSkills: presentSkills.map(skill => 
      requiredSkills.find(originalSkill => 
        originalSkill.toLowerCase().trim() === skill
      )
    ),
    gapPercentage: Math.round((missingSkills.length / requiredSkills.length) * 100),
    hasGap: missingSkills.length > 0
  };
};

// Get course suggestions for missing skills
export const getCourseSuggestions = (missingSkills) => {
  const suggestions = [];
  
  missingSkills.forEach(skill => {
    const skillKey = Object.keys(COURSE_CATALOG).find(key => 
      key.toLowerCase() === skill.toLowerCase()
    );
    
    if (skillKey && COURSE_CATALOG[skillKey]) {
      suggestions.push(...COURSE_CATALOG[skillKey]);
    }
  });
  
  // Remove duplicates and sort by rating
  const uniqueSuggestions = suggestions.filter((course, index, self) => 
    index === self.findIndex(c => c.id === course.id)
  ).sort((a, b) => b.rating - a.rating);
  
  return uniqueSuggestions.slice(0, 6); // Return top 6 suggestions
};

// Calculate skill match percentage
export const calculateSkillMatch = (studentSkills = [], requiredSkills = []) => {
  if (requiredSkills.length === 0) return 100;
  
  const { presentSkills } = analyzeSkillGap(studentSkills, requiredSkills);
  return Math.round((presentSkills.length / requiredSkills.length) * 100);
};
