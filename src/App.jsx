import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Form } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Formm from "./components/Form"
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JoinGroupPage from './pages/JoinGroupPage';

// Dashboard Pages (to be created)
import StudentDashboard from './pages/student/Dashboard';
import StudentOpportunities from './pages/student/Opportunities';
import AdminDashboard from './pages/admin/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';
import Dashboard from './components/Dashboard';
import Blog from './components/Blog';
import AboutUs from './components/Aboutus';
import Thanks from './components/Thanks';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/join-group/:inviteCode" element={<JoinGroupPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/company/*"
                element={
                  <ProtectedRoute allowedRoles={['COMPANY']}>
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path='/form' element={<Formm></Formm>}></Route>
              {/* Default redirect */}
              <Route path="/" element={<Dashboard></Dashboard>}/>
              <Route path='/blog' element={<Blog></Blog>}></Route>
               <Route path='/Aboutus' element={<AboutUs></AboutUs>}></Route>
               <Route path="/thanks" element={<Thanks />}></Route>
              {/* 404 */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;