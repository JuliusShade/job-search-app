import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import JobList from "./components/JobList";
import { fetchJobPostings } from "./api/indeedApi";
import "./App.css";
import Loading from "./components/Loading"; // Import Loading component

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSearch = async (query, location, radius) => {
    setLoading(true); // Set loading to true before the API call
    try {
      const jobData = await fetchJobPostings(query, location, radius);
      setJobs(jobData.hits);
    } catch (error) {
      console.error("Error during job search:", error);
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Search</h1>
        <SearchForm onSearch={handleSearch} />
        {loading ? <Loading /> : <JobList jobs={jobs} />}
      </header>
    </div>
  );
};

export default App;
