import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import "../App.css";
const CustomerInfo = ({ info }) => {
  //   console.log(customer);
  return (
    <div className="customer-info-container">
      <h3 className="CustomerInfo_title">고객정보</h3>
      <hr />
      <div className="infoItem">
        <span>생년월일</span>
        <span className="infoSpan">
          {info.birth} (만 {info.age}세)
        </span>
      </div>
      <div className="infoItem">
        <span>주소</span>
        <span className="infoSpan">{info.address}</span>
      </div>
      <div className="infoItem">
        <span>고객 관리 시기</span>
        <span className="infoSpan">{info.intensiveCareStartDate}</span>
      </div>
    </div>
  );
};
export default CustomerInfo;
