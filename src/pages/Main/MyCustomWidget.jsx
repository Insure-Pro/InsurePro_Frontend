// MyCustomWidget.jsx
import React from "react";

const MyCustomWidget = (props) => {
  return (
    <div
      style={{
        backgroundColor: "#f4f4f4",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <p>This is a custom widget!</p>
      <button
        style={{
          backgroundColor: "#4caf50",
          color: "#fff",
          padding: "10px",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Custom Button
      </button>
    </div>
  );
};

export default MyCustomWidget;
