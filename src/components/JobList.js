import React, { useState, useEffect } from "react";
import { fetchJobDetails, fetchJobPostings } from "../api/indeedApi";
import { cleanHTML } from "../utils/cleanHTML";
import "./JobList.css";
import Loading from "./Loading"; // Import Loading component

const JobList = ({ jobs: initialJobs, searchParams, useMock = false }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [nextPageId, setNextPageId] = useState(null);

  const countJobPostingsByEmployer = (jobs) => {
    const counts = {};
    jobs.forEach((job) => {
      counts[job.company_name] = (counts[job.company_name] || 0) + 1;
    });
    return counts;
  };

  const jobCounts = countJobPostingsByEmployer(jobs);

  const sortJobsByEmployerCount = (jobs, counts) => {
    return jobs.sort((a, b) => counts[b.company_name] - counts[a.company_name]);
  };

  const sortedJobs = sortJobsByEmployerCount(jobs, jobCounts);

  const handleViewDetails = async (jobId) => {
    if (selectedJob === jobId && showDetails) {
      setShowDetails(false);
      return;
    }

    setLoadingDetails((prevLoading) => ({ ...prevLoading, [jobId]: true }));

    setSelectedJob(jobId);

    if (!jobDetails[jobId]) {
      try {
        const details = await fetchJobDetails(jobId, useMock);
        setJobDetails((prevDetails) => ({
          ...prevDetails,
          [jobId]: details,
        }));
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    }

    setShowDetails(true);
    setLoadingDetails((prevLoading) => ({ ...prevLoading, [jobId]: false }));
  };

  const handleHideDetails = () => {
    setShowDetails(false);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetchJobPostings({ ...searchParams, useMock });
        setJobs(response.hits);
        setNextPageId(response.next_page_id);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
      setLoading(false);
    };

    if (searchParams.query && searchParams.location && searchParams.radius) {
      fetchJobs();
    }
  }, [searchParams, useMock]);

  const handleLoadMore = async () => {
    if (!nextPageId) return;

    setLoading(true);
    try {
      const response = await fetchJobPostings({
        page: nextPageId,
        ...searchParams,
        useMock,
      });
      setJobs((prevJobs) => {
        const updatedJobs = [...prevJobs, ...response.hits];
        const updatedJobCounts = countJobPostingsByEmployer(updatedJobs);
        return sortJobsByEmployerCount(updatedJobs, updatedJobCounts);
      });
      setNextPageId(response.next_page_id);
    } catch (error) {
      console.error("Error loading more jobs:", error);
    }
    setLoading(false);
  };

  return (
    <div>
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
            <button onClick={() => handleViewDetails(job.id)}>
              {loadingDetails[job.id] ? <Loading /> : "View Job"}
            </button>
            <div
              className={`job-details ${
                selectedJob === job.id && showDetails ? "show" : ""
              }`}
            >
              {loadingDetails[job.id] ? (
                <p>Loading...</p>
              ) : (
                <>
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
                  <button onClick={handleHideDetails}>Hide Details</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {nextPageId && (
        <div className="load-more-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <button className="load-more-button" onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
