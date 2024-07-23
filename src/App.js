import React, { useState } from "react";
import axios from "axios";
import SearchForm from "./components/SearchForm";
import JobList from "./components/JobList";
import "./App.css";

const App = () => {
  const [jobs, setJobs] = useState([]);

  const handleSearch = async (location, radius) => {
    try {
      const response = await axios.get(
        `https://api.indeed.com/v2/jobs/search?location=${location}&radius=${radius}&sort_by=date&limit=10`,
        {
          headers: {
            Authorization: "Bearer YOUR_INDEED_API_KEY",
          },
        }
      );
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Search</h1>
        <SearchForm onSearch={handleSearch} />
        <JobList jobs={jobs} />
      </header>
    </div>
  );
};

export default App;
