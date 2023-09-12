import axios from "axios";
import React, { useRef, useState } from "react";
import "../App.css";
import Navbar from "./Navbar";
import Nav from "react-bootstrap/Nav";
import Dbbar from "../components/Dbbar";

const Main = () => {
  return (
    <div>
      <div className="Db_container">
        <Dbbar>
          <div className="Add_Btn">
            <button>Add</button>
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
