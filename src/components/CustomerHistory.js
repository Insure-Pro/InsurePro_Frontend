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
      <h2>고객 일정</h2>
      {historyData.map((history) => (
        <div key={history.pk}>
          <p>날짜: {history.date}</p>
          <p>메모: {history.memo}</p>
          <p>주소: {history.address}</p>
          <p>진척도: {history.progress}</p>
        </div>
      ))}
      <HistoryModal customerPk={customerPk} />
    </div>
  );
};

export default CustomerHistory;
