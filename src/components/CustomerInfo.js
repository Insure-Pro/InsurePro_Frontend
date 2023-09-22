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
      <h3 className="title">고객정보</h3>
      <hr />
      <div className="infoItem">
        <span>생년월일</span>
        <span>{info.birth}</span>
      </div>
      <div className="infoItem">
        <span>주소</span>
        <span>{info.address}</span>
      </div>
      <div className="infoItem">
        <span>고객관리</span>
        <span>{info.intensiveCareStartDate}</span>
      </div>
    </div>
  );
};
export default CustomerInfo;
