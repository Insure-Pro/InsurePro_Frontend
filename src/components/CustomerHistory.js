import HistoryModal from "../components/HistoryModal";
import React from "react";
import axios from "axios";
import { useRef, useState, useEffect } from "react";

const CustomerHistory = ({ customerPk }) => {
  const [historyData, setHistoryData] = useState([]);

  const fetchCustomerHistory = async () => {
    try {
      const url = `http://52.79.81.200:8080/v1/schedules/${customerPk}`;
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

  useEffect(() => {
    fetchCustomerHistory();
  }, [customerPk]);

  //진척도
  const historyItemStyle1 = {
    flex: "none",
    width: "90px",
    textAlign: "center",
    justifyContent: "center", //진척도 세로축 가운데 정렬
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderRadius: "5px",
    color: "#175CD3",
    fontWeight: "700",
  };
  //시간,장소
  const historyItemStyle2 = {
    flex: "none", // flex 속성 제거
    width: "700px",
    textAlign: "start",
    padding: "2px", // 아이템 내부 여백 조절
    marginLeft: "8px",
    borderRightRadius: "20px",
    borderRadius: "5px",
    fontWeight: "700",
    // borderRadius: "0 5px 5px 0",//오른쪽 모서리
  };
  //메모
  const historyItemStyle3 = {
    flex: "none", // flex 속성 제거
    width: "700px",
    textAlign: "start",
    padding: "2px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderRadius: "5px",

    // borderRadius: "5px 0 0 5px",// 왼쪽모서리
  };
  //
  const historyItemStyle4 = {
    flex: "none", // flex 속성 제거
    width: "200px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
  };
  return (
    <div className="customer-history-container">
      <div
        className="customer-histoy-top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "0px 26px",
        }}
      >
        <h5 style={{ fontWeight: "700" }}>고객 히스토리</h5>
        <HistoryModal
          customerPk={customerPk}
          onNewData={fetchCustomerHistory}
        />
      </div>
      {historyData.map((history) => (
        <div
          key={history.pk}
          style={{
            display: "flex",
            alignItems: "center", // 진척도 가로축 가운데 정렬
            width: "860px",
            margin: "4px",
            marginBottom: "12px",
            marginLeft: "156px",
            padding: "3px",
            backgroundColor: "#FFF",
            borderRadius: "50px",
            boxShadow: "10px 4px 4px 0px rgba(46, 64, 97, 0.10)",
          }}
        >
          <div style={historyItemStyle1}>{history.progress}</div>
          <div>
            <div style={historyItemStyle2}>
              {history.date} {history.address}
            </div>
            <div style={historyItemStyle3}>{history.memo}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerHistory;
