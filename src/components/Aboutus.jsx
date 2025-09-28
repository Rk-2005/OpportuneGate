import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function AboutUs() {
  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      {/* Go Back Button */}
      
      <div className="mb-6">
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          ← Go Back
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About Us</h1>
        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          Welcome to <span className="font-semibold">OpportuneGate</span> – your
          trusted platform for internships, placements, and career growth.  
          We believe every student deserves equal access to opportunities, and
          every recruiter deserves a simple way to connect with the right talent.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              🎓 For Students
            </h2>
            <p className="text-gray-600">
              Explore opportunities, apply for internships and jobs, track your
              applications, and prepare for interviews – all in one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              🏢 For Companies
            </h2>
            <p className="text-gray-600">
              Simplify recruitment by posting opportunities, managing applicants,
              and scheduling interviews with ease.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition md:col-span-2">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              📌 Our Mission
            </h2>
            <p className="text-gray-600">
              We aim to bridge the gap between students, colleges, and companies
              by providing a secure, user-friendly, and efficient platform that
              streamlines the entire internship and placement process.
            </p>
          </div>
        </div>

        <p className="mt-8 text-gray-700">
          Together, let’s unlock opportunities and build brighter futures 🚀
        </p>
      </div>
    </div>
    </>
  );
}
