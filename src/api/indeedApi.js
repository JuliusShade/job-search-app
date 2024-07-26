import axios from "axios";
import { mockJobPostings, mockJobDetails } from "./mockData";

const useMockData = false; // Toggle this to switch between mock data and real API

console.log("API Key:", process.env.REACT_APP_RAPIDAPI_KEY); // Print the API key

export const fetchJobPostings = async (query, location, radius) => {
  if (useMockData) {
    return mockJobPostings;
  }

  const options = {
    method: "GET",
    url: "https://indeed12.p.rapidapi.com/jobs/search",
    params: {
      query: query,
      location: location,
      page_id: "1",
      locality: "us",
      fromage: "1",
      radius: radius,
      sort: "date",
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": "indeed12.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching job postings:", error);
    throw new Error("Could not fetch job postings");
  }
};

export const fetchJobDetails = async (jobId) => {
  if (useMockData) {
    return mockJobDetails;
  }

  const options = {
    method: "GET",
    url: `https://indeed12.p.rapidapi.com/job/${jobId}`,
    params: { locality: "us" },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": "indeed12.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw new Error("Could not fetch job details");
  }
};
