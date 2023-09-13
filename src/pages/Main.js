import axios from "axios";
import React, { useRef, useState } from "react";
import "../App.css";
import Dbbar from "../components/Dbbar";
import Modal1 from "../components/Modal";

const Main = () => {
  return (
    <div>
      <div className="Db_container">
        <Dbbar>
          <div className="Add_Btn">
            <Modal1 />
          </div>
          <div className="Db_content">
            <div>DB 분배일</div>
            <div>고객유형</div>
            <div>이름</div>
            <div>생년월일 (나이)</div>
            <div>연락처</div>
            <div>거주지</div>
          </div>
        </Dbbar>
      </div>
    </div>
  );
};

export default Main;
