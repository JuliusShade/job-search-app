import axios from "axios";
import { mockJobPostings, mockJobDetails } from "./mockData";

// Function to fetch job postings with pagination support
export const fetchJobPostings = async ({
  page = 1,
  query,
  location,
  radius,
  useMock = false,
}) => {
  if (useMock) {
    return mockJobPostings;
  }

  const options = {
    method: "GET",
    url: "https://indeed12.p.rapidapi.com/jobs/search",
    params: {
      query: query || "manager",
      location: location || "chicago",
      page_id: page.toString(),
      locality: "us",
      fromage: "1",
      radius: radius || "50",
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
    throw error;
  }
};

// Function to fetch job details
export const fetchJobDetails = async (jobId, useMock = false) => {
  if (useMock) {
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
    throw error;
  }
};
