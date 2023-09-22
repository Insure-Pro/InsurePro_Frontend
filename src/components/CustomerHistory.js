import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

const CustomerHistory = ({ histories }) => {
  return (
    <div className="customerHistorySection">
      <h3 className="title">
        고객히스토리
        {/* <img src="edit.png" alt="Edit Icon" className="editIcon" /> */}
      </h3>
      <hr />
      {/* {histories.map((history) => (
        <div key={history.id} className="historyItem">
          <span className="progress">{history.progress}</span>
          <span className="dateLocation">
            {history.date} {history.location}
          </span>
          <p>{history.memo}</p>
        </div>
      ))} */}
    </div>
  );
};

export default CustomerHistory;
