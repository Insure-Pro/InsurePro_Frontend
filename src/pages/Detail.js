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
  const [customerDetail, setCustomerDetail] = useState({});
  const [customerHistories, setCustomerHistories] = useState([]);
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
          //   console.log(response.data); // This will print the response data
        }
      } catch (error) {
        console.error("Error fetching customer detail:", error.message);
      }
    };
    fetchCustomerDetail();
  }, [customerPk]);

  useEffect(() => {
    console.log(customerHistories);
    // console.log(customerDetail); // This will print the updated state
  }, [customerDetail]);

  const handleAddHistory = (history) => {
    setCustomerHistories((prevHistories) => [history, ...prevHistories]);
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F5FAFF",
      }}
    >
      <Navbar />
      <div style={{ borderLeft: "2px solid #DDE1E6" }}>
        {customerDetail && Object.keys(customerDetail).length > 0 && (
          <>
            <CustomerDetail info={customerDetail} />
            <div style={{ display: "flex" }}>
              <CustomerInfo info={customerDetail} />
              <CustomerHistory history={customerHistories} />
            </div>
            <HistoryModal onAddHistory={handleAddHistory} />
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
