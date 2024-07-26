import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import JobList from "./components/JobList";
import { fetchJobPostings } from "./api/indeedApi";
import "./App.css";

const App = () => {
  const [jobs, setJobs] = useState([]);

  const handleSearch = async (query, location, radius) => {
    console.log("handleSearch called with:", { query, location, radius });
    try {
      const jobData = await fetchJobPostings(query, location, radius);
      console.log("API response:", jobData);
      setJobs(jobData.hits); // Adjust this line according to the actual structure of your API response
    } catch (error) {
      console.error("Error during job search:", error);
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
