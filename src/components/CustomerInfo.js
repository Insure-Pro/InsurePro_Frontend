import "../App.css";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const CustomerInfo = ({ customerPk }) => {
  const [infoData, setInfoData] = useState({});

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const url = `http://52.79.81.200:8080/v1/customer/${customerPk}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setInfoData(response.data);
      } catch (error) {
        console.error("Fetching customer info failed", error);
      }
    };
    fetchCustomerInfo();
  }, [customerPk]);
  return (
    <div>
      <div style={{ display: "flex" }}>
        <hr />
        <div className="infoItem">
          <span>생년월일</span>
          <span className="infoSpan">
            {infoData.birth} (만 {infoData.age}세)
          </span>
        </div>
        <div className="infoItem">
          <span>주소</span>
          <span className="infoSpan">{infoData.address}</span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="infoItem">
          <span>특이사항</span>
          <span className="infoSpan">{infoData.memo}</span>
        </div>
        <div className="infoItem">
          <span>고객 관리 시기</span>
          <span className="infoSpan">{infoData.intensiveCareStartDate}</span>
        </div>
      </div>
    </div>
  );
};
export default CustomerInfo;
