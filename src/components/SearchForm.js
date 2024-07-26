import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { usCities } from "../data/usCities";
import "./SearchForm.css";

const SearchForm = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, location, radius);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => (
    <div className="suggestion-item">{suggestion}</div>
  );

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : usCities
          .filter((city) => city.toLowerCase().includes(inputValue))
          .slice(0, 5); // Limit to top 5 suggestions
  };

  const inputProps = {
    placeholder: "Type a city",
    value: location,
    onChange: (e, { newValue }) => {
      setLocation(newValue);
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="query">Job Title:</label>
        <input
          type="text"
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
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
