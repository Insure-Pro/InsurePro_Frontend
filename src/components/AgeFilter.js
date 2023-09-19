// AgeFilter.js
import React, { useState } from "react";

const AgeFilter = ({ onAgeFilterChange }) => {
  const [selectedAge, setSelectedAge] = useState(""); // 선택된 나이 필터

  const handleAgeFilterChange = (event) => {
    const age = event.target.value;
    setSelectedAge(age);
    onAgeFilterChange(age);
  };

  return (
    <select value={selectedAge} onChange={handleAgeFilterChange}>
      <option value="">전체</option>
      <option value="1020">10~20세</option>
      <option value="3040">30~40세</option>
      <option value="5060">50~60세</option>
    </select>
  );
};

export default AgeFilter;
