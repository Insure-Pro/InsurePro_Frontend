import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";

import CustomerDetail from "../components/CustomerDetail";
import CustomerInfo from "../components/CustomerInfo"; // Assuming you have this component
import CustomerHistory from "../components/CustomerHistory"; // Assuming you have this component
import HistoryModal from "../components/HistoryModal";
import { useLocation } from "react-router-dom";

const Detail = () => {
  const location = useLocation();
  const { customerPk } = location.state;
  const [customerDetail, setCustomerDetail] = useState({});
  const [customerSchedules, setCustomerSchedules] = useState({});

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const response = await axios.get(
          `http://3.38.101.62:8080/v1/customer/${customerPk}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setCustomerDetail(response.data);
      } catch (error) {
        console.error("Error fetching customer detail:", error);
      }
    };

    const fetchCustomerSchedules = async () => {
      try {
        const response = await axios.get(
          `http://3.38.101.62:8080/v1/schedules/${customerPk}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setCustomerSchedules(response.data);
      } catch (error) {
        console.error("Error fetching customer schedules:", error);
      }
    };

    fetchCustomerDetail();
    fetchCustomerSchedules();
  }, [customerPk]);

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F5FAFF",
        width: "1400px",
        margin: "0 auto",
        borderRight: "2px solid #dde1e6",
      }}
    >
      <Navbar />
      <div
        style={{
          marginLeft: "302px",
          height: "110vh",
        }}
      >
        <>
          <CustomerDetail data={customerDetail} customerPk={customerPk} />
          <hr />
          <div style={{ display: "flex" }}>
            <CustomerInfo data={customerDetail} customerPk={customerPk} />
          </div>
          <hr />
          <CustomerHistory data={customerSchedules} customerPk={customerPk} />
        </>
      </div>
    </div>
  );
};

export default Detail;
