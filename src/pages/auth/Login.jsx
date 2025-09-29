import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeoutMessage, setTimeoutMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-populate email based on selected role
  useEffect(() => {
    if (selectedRole === 'admin') {
      setFormData({
        email: 'admin@example.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'student@example.com',
        password: 'admin123'
      });
    }
  }, [selectedRole]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && timeoutMessage) {
      setTimeoutMessage('');
    }
    return () => clearInterval(interval);
  }, [countdown, timeoutMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeoutMessage('');
    setCountdown(0);
    
    // Set a timeout for the login request
    const timeoutId = setTimeout(() => {
      if (loading) {
        setTimeoutMessage('Backend may be down, please wait...');
        setCountdown(50); // 50 second countdown
      }
    }, 10000); // Show message after 10 seconds

    try {
      const result = await login(formData.email, formData.password);
      
      // Clear timeout if login completes
      clearTimeout(timeoutId);
      
      if (!result.success) {
        setLoading(false);
        setTimeoutMessage('');
        setCountdown(0);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      setLoading(false);
      setTimeoutMessage('');
      setCountdown(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your OpportunityGate account
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="bg-white py-6 px-6 shadow-xl rounded-lg">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                selectedRole === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student
            </button>
          </div>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Timeout Message */}
            {timeoutMessage && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="animate-pulse w-4 h-4 bg-yellow-400 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800 font-medium">
                      {timeoutMessage}
                    </p>
                    {countdown > 0 && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Backend will automatically come up in {countdown} seconds
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
