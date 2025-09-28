import React, { useState } from "react";
import mainimg from "../assets/main_img.png"
import { 
  FiHome, 
  FiBriefcase, 
  FiInfo, 
  FiBook, 
  FiMenu,
  FiX,
  FiArrowRight,
  FiMessageCircle,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiGlobe,
  FiCheck,
  FiStar,
  FiPlay,
  FiUser,
  FiPhone,
  FiMail
} from "react-icons/fi";
import { FaBuilding, FaGraduationCap, FaLaptopCode, FaUserTie, FaChalkboardTeacher } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate=useNavigate();
  const navItems = [
    { name: "Home", icon: <FiHome /> },
    { name: "Institutions", icon: <FaBuilding /> },
    { name: "Employers", icon: <FiBriefcase /> },
    { name: "About Us", icon: <FiInfo /> },
    { name: "Blogs", icon: <FiBook /> },
  ];

  const features = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "10,000+",
      subtitle: "Active Students"
    },
    {
      icon: <FaBuilding className="w-6 h-6" />,
      title: "500+",
      subtitle: "Partner Institutions"
    },
    {
      icon: <FiBriefcase className="w-6 h-6" />,
      title: "1,000+",
      subtitle: "Hiring Partners"
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: "95%",
      subtitle: "Success Rate"
    }
  ];

  const services = [
    {
      icon: <FaGraduationCap className="w-8 h-8" />,
      title: "Campus Placement",
      description: "End-to-end campus recruitment solutions with AI-powered candidate matching",
      features: ["Automated scheduling", "Skill assessment", "Real-time analytics", "Interview management"]
    },
    {
      icon: <FaLaptopCode className="w-8 h-8" />,
      title: "Skill Development",
      description: "Comprehensive learning paths and industry-relevant certification programs",
      features: ["Industry courses", "Mentorship programs", "Certification", "Live projects"]
    },
    {
      icon: <FaUserTie className="w-8 h-8" />,
      title: "Career Guidance",
      description: "Personalized career counseling and professional roadmap planning",
      features: ["1-on-1 mentoring", "Career assessment", "Interview prep", "Resume building"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director, TechCorp",
      content: "OpportunityGate transformed our campus hiring process. We reduced hiring time by 60% while improving candidate quality significantly.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Dr. Michael Chen",
      role: "University Dean",
      content: "The digital campus solution has revolutionized how we manage student placements and career development programs.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Recent Graduate",
      content: "Found my dream job through OpportunityGate. The career guidance and interview preparation were absolutely invaluable!",
      rating: 5,
      avatar: "ER"
    }
  ];

  const partners = [
    { name: "Tech University", logo: "TU" },
    { name: "Global Corp", logo: "GC" },
    { name: "Innovate Inc", logo: "II" },
    { name: "Edu Systems", logo: "ES" },
    { name: "Career Build", logo: "CB" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">OG</span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                OpportunityGate
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-0">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href="#"
                  className="relative px-5 py-2.5 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 text-sm rounded-lg mx-1 hover:bg-blue-50"
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1, width: '80%' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center space-x-3">
             
              <motion.button 
              onClick={()=>navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden text-gray-700 text-lg p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-3 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 p-4 shadow-lg"
              >
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href="#"
                    className="flex items-center space-x-3 py-3 text-gray-700 hover:text-blue-600 font-medium border-b border-gray-100 last:border-b-0 transition-colors duration-200 px-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <span className="text-gray-500 text-base">{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </motion.a>
                ))}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200 px-2 space-x-2">
                  <motion.button 
                    className="flex-1 text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 text-sm border border-gray-200"
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                  <motion.button 
                  onClick={navigate("/login")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 text-sm"
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FiTrendingUp className="w-4 h-4 mr-2" />
                #1 Career Development Platform
              </motion.div>
              
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  Building <span className="text-blue-600">Careers</span>,
                  <br />
                  Digitizing <span className="text-indigo-600">Campuses</span>,
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Revolutionizing
                  </span> Recruitments
                </h1>

                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  The fastest growing career development platform that brings together academia, companies, students, and alumni in a single digital ecosystem.
                </p>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-blue-600 flex justify-center mb-3">
                    {feature.icon}
                  </div>
                  <div className="font-bold text-lg lg:text-xl text-gray-900 mb-1">{feature.title}</div>
                  <div className="text-xs lg:text-sm text-gray-600">{feature.subtitle}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button 
                className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Start Your Journey</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
              <motion.button 
                className="group bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 border border-gray-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlay className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Image - Increased Size */}
          <motion.div 
            className="flex justify-center lg:justify-end items-start"
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative w-full max-w-2xl">
              {/* Background decorations */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute  -left-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -bottom-6 -right-6 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl"
                animate={{ 
                  y: [0, 15, 0],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              {/* Main image container - Increased Size */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-4 border border-white/50">
                <img
                  src={mainimg}
                  alt="Career development platform showing students and professionals collaborating"
                  className="w-full h-50 lg:h-[500px] rounded-xl shadow-lg object-cover"
                />
              </div>
              
              {/* Floating success card */}
              <motion.div 
                className="absolute -bottom-6 left-6 bg-white rounded-2xl p-5 shadow-2xl border border-gray-100"
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiAward className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">2,500+ Hires</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive career development and recruitment solutions designed for modern educational institutions and forward-thinking companies
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white text-2xl">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-gray-700">
                      <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Success <span className="text-blue-600">Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from institutions, employers, and students who have transformed their career journeys with OpportunityGate
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted <span className="text-blue-600">Partners</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of leading institutions and companies worldwide who trust OpportunityGate
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-4">
                  {partner.logo}
                </div>
                <div className="font-semibold text-gray-900">{partner.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Career Ecosystem?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of institutions, employers, and students who are revolutionizing career development and recruitment with OpportunityGate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Free
              </motion.button>
              <motion.button 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OG</span>
                </div>
                <div className="text-xl font-bold text-white">OpportunityGate</div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing career development and campus recruitment through innovative digital solutions that connect academia with industry.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">For Institutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Employers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Students</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Contact Info</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-blue-400" />
                  <span>hello@opportunitygate.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FiPhone className="w-5 h-5 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FiUser className="w-5 h-5 text-blue-400" />
                  <span>24/7 Support Available</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OpportunityGate. All rights reserved. Building futures, one career at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;