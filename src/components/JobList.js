import React, { useState } from "react";
import { fetchJobDetails } from "../api/indeedApi";

const JobList = ({ jobs = [] }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = async (jobId) => {
    if (selectedJob === jobId && showDetails) {
      setShowDetails(false);
      return;
    }

    try {
      const details = await fetchJobDetails(jobId);
      setSelectedJob(jobId);
      setJobDetails(details);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  return (
    <div>
      <h2>Job Listings</h2>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <h3>{job.title}</h3>
            <p>{job.company_name}</p>
            <p>{job.location}</p>
            <p>{job.formatted_relative_time}</p>
            <button onClick={() => handleViewDetails(job.id)}>View Job</button>
            {selectedJob === job.id && showDetails && (
              <div className="job-details">
                <h4>Job Details</h4>
                <p>Description: {jobDetails.description}</p>
                {jobDetails.salary && (
                  <p>
                    Salary: ${jobDetails.salary.min} - ${jobDetails.salary.max}{" "}
                    {jobDetails.salary.type}
                  </p>
                )}
                <p>
                  Posted on:{" "}
                  {new Date(jobDetails.pub_date_ts_milli).toLocaleDateString()}
                </p>
                <button onClick={() => setShowDetails(false)}>
                  Hide Details
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
