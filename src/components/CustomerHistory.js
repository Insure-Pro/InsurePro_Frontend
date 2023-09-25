import HistoryModal from "../components/HistoryModal";
import React from "react";
import axios from "axios";
import { useRef, useState, useEffect } from "react";

const CustomerHistory = ({ customerPk }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchCustomerHistory = async () => {
      try {
        const url = `http://52.79.81.200:8080/v1/schedule/${customerPk}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching customer history:", error.message);
      }
    };
    fetchCustomerHistory();
  }, [customerPk]);

  return (
    <div className="customer-history-container">
      <div
        className="customer-histoy-top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 26px",
        }}
      >
        <h5>고객 히스토리</h5>
        <HistoryModal customerPk={customerPk} />
      </div>
      {historyData.map((history) => (
        <div key={history.pk}>
          <p>날짜: {history.date}</p>
          <p>메모: {history.memo}</p>
          <p>주소: {history.address}</p>
          <p>진척도: {history.progress}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerHistory;
