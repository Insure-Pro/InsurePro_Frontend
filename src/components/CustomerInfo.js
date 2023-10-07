import "../App.css";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const CustomerInfo = ({ data }) => {
  return (
    <div style={{ margin: "-10px 0px" }}>
      <div>
        {/* <hr /> */}
        <div className="infoItem">
          <span>생년월일</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {data.birth} (만 {data.age}세)
          </span>
        </div>
        <div className="infoItem">
          <span>주소</span>
          <span className="infoSpan" style={{ marginLeft: "115px" }}>
            {data.address}
          </span>
        </div>
      </div>
      <div>
        <div className="infoItem">
          <span>특이사항</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {data.memo}
          </span>
        </div>
        <div className="infoItem">
          <span>인수상태</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {data.state}
          </span>
        </div>
      </div>
    </div>
  );
};
export default CustomerInfo;
