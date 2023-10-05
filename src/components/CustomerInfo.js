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
        const url = `http://3.38.101.62:8080/v1/customer/${customerPk}`;
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
    <div style={{ margin: "-10px 0px" }}>
      <div>
        {/* <hr /> */}
        <div className="infoItem">
          <span>생년월일</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {infoData.birth} (만 {infoData.age}세)
          </span>
        </div>
        <div className="infoItem">
          <span>주소</span>
          <span className="infoSpan" style={{ marginLeft: "115px" }}>
            {infoData.address}
          </span>
        </div>
      </div>
      <div>
        <div className="infoItem">
          <span>특이사항</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {infoData.memo}
          </span>
        </div>
        <div className="infoItem">
          <span>인수상태</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {infoData.state}
          </span>
        </div>
      </div>
    </div>
  );
};
export default CustomerInfo;
