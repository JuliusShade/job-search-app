import React from "react";

const JobList = ({ jobs }) => {
  return (
    <div>
      <h2>Job Listings</h2>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <h3>{job.company}</h3>
            <p>{job.title}</p>
            <p>{job.location}</p>
            <p>{job.posted_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
