import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";
import { useLocation } from "react-router-dom";

const Detail = () => {
  const [customerDetail, setCustomerDetail] = useState({});
  const location = useLocation();
  const { customerPk } = location.state;

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const url = `http://52.79.81.200:8080/v1/customer/${customerPk}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (response.data) {
          setCustomerDetail(response.data);
        }
      } catch (error) {
        console.error("Error fetching customer detail:", error.message);
      }
    };
    fetchCustomerDetail();
  }, [customerPk]);

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Detail;
