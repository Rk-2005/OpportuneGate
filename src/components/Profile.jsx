import React, { useState, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";

function Profile() {
  const {
    profile,
    completionPercentage,
    isLoading,
    error,
    updateProfile,
    uploadResume,
    isUpdating,
    isUploadingResume,
  } = useProfile();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    headline: "",
  });

  const [resumeUrl, setResumeUrl] = useState("");

  // Load profile data into form when available
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        headline: profile.headline || "",
      });
      setResumeUrl(profile.resumeUrl || "");
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleResumeUpload = (e) => {
    e.preventDefault();
    if (!resumeUrl) return;
    uploadResume(resumeUrl);
  };

  if (isLoading) return <p className="p-4">Loading profile...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Completion Bar */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">
          Profile Completion: {completionPercentage}%
        </p>
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Profile Update Form */}
      <form onSubmit={handleSave} className="space-y-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="headline"
          placeholder="Headline (e.g. Frontend Developer)"
          value={formData.headline}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isUpdating ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* Resume Upload */}
      <form onSubmit={handleResumeUpload} className="space-y-3">
        <input
          type="text"
          placeholder="Resume URL"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={isUploadingResume}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {isUploadingResume ? "Uploading..." : "Upload Resume"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
