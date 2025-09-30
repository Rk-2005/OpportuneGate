import React from "react";
import { useApplications } from "../hooks/useApplications";

function Applications() {
  const {
    applications,
    isLoading,
    error,
  } = useApplications();

  if (isLoading) return <p className="p-4">Loading applications...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">You haven’t applied to any opportunities yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li
              key={app.id}
              className="p-4 border rounded shadow-sm bg-white flex flex-col gap-2"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {app.opportunity?.title || "Untitled Opportunity"}
                </h2>
                <p className="text-gray-600">
                  Company: {app.opportunity?.company || "Amazon"}
                </p>
              </div>

              <div className="mt-2">
                <span className="px-2 py-1 rounded text-sm font-medium bg-gray-100">
                  Status: {app.status}
                </span>
              </div>

              {app.notes && (
                <p className="text-sm text-gray-700 mt-1">Notes: {app.notes}</p>
              )}

              {app.interviewDate && (
                <p className="text-sm text-blue-600">
                  Interview: {app.interviewDate} {app.interviewTime && `at ${app.interviewTime}`}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                Applied on: {new Date().toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Applications;
