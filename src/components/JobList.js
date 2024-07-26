import React, { useState, useEffect } from "react";
import { fetchJobDetails } from "../api/indeedApi";
import { cleanHTML } from "../utils/cleanHTML";
import "./JobList.css";

const JobList = ({ jobs = [] }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // Count job postings by employer
  const jobCounts = countJobPostingsByEmployer(jobs);
  // Sort jobs by employer count
  const sortedJobs = sortJobsByEmployerCount(jobs, jobCounts);

  const handleViewDetails = async (jobId) => {
    if (selectedJob === jobId && showDetails) {
      setShowDetails(false);
      return;
    }

    setLoading(true);
    setSelectedJob(jobId);

    if (!jobDetails[jobId]) {
      try {
        const details = await fetchJobDetails(jobId);
        setJobDetails((prevDetails) => ({
          ...prevDetails,
          [jobId]: details,
        }));
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    }

    setShowDetails(true);
    setLoading(false);
  };

  return (
    <div>
      <h2>Job Listings</h2>
      <ul className="job-listings">
        {sortedJobs.map((job, index) => (
          <li key={index} className="job-item">
            <h3 className="job-title">{job.title}</h3>
            <p className="job-company">{job.company_name}</p>
            <p className="job-location">{job.location}</p>
            <p className="job-time">{job.formatted_relative_time}</p>
            <span className="job-count">
              Number of Job Postings by this employer:{" "}
              {jobCounts[job.company_name]}
            </span>
            <button onClick={() => handleViewDetails(job.id)}>View Job</button>
            {selectedJob === job.id && showDetails && (
              <div className="job-details">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <h4>Job Details</h4>
                    <p>
                      Description: {cleanHTML(jobDetails[job.id]?.description)}
                    </p>
                    {jobDetails[job.id]?.salary && (
                      <p>
                        Salary: ${jobDetails[job.id].salary.min} - $
                        {jobDetails[job.id].salary.max}{" "}
                        {jobDetails[job.id].salary.type}
                      </p>
                    )}
                    <p>
                      Posted on:{" "}
                      {new Date(
                        jobDetails[job.id]?.pub_date_ts_milli
                      ).toLocaleDateString()}
                    </p>
                    <button onClick={() => setShowDetails(false)}>
                      Hide Details
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const countJobPostingsByEmployer = (jobs) => {
  const counts = {};

  jobs.forEach((job) => {
    counts[job.company_name] = (counts[job.company_name] || 0) + 1;
  });

  return counts;
};

const sortJobsByEmployerCount = (jobs, counts) => {
  return jobs.sort((a, b) => counts[b.company_name] - counts[a.company_name]);
};

export default JobList;
