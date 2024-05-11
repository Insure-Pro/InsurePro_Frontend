import React from "react";
import "./SkeletonHistory.css";
import "./SkeletonMain.css";

const SkeletonElement = ({ type }) => {
  const classes = `skeleton ${type}`;
  return <div className={classes}></div>;
};

export default SkeletonElement;
