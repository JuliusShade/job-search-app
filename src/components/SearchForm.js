import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(location, radius);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="radius">Radius (miles):</label>
        <input
          type="number"
          id="radius"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          required
        />
      </div>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
