import React from "react";
import "./FoodFilter.css";

const FoodFilter = ({
  searchTerm,
  setSearchTerm,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) => {
  const handlePriceChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setter(value);
    }
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="price-filter">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={handlePriceChange(setMinPrice)}
          min="0"
          step="0.01"
          className="price-input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handlePriceChange(setMaxPrice)}
          min="0"
          step="0.01"
          className="price-input"
        />
      </div>
    </div>
  );
};

export default FoodFilter;
