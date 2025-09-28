import React, { useState } from "react";
import { 
  FiHome, 
  FiBriefcase, 
  FiInfo, 
  FiBook, 
  FiMenu,
  FiX
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Home", icon: <FiHome />, link: "/" },
    { name: "Institutions", icon: <FaBuilding />, link: "/Form" },
    { name: "Employers", icon: <FiBriefcase />, link: "/Form" },
    { name: "About Us", icon: <FiInfo />, link: "/aboutus" },
    { name: "Blogs", icon: <FiBook />, link: "/blog" },
  ];

  return (
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
                href={item.link}
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
              onClick={() => navigate("/login")}
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
                  href={item.link}
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
                  onClick={() => navigate("/login")}
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
  );
}

export default Navbar;