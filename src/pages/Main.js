import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Dbbar from "../components/Dbbar";
import Modal1 from "../components/Modal";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";

const Main = () => {
  const [customers, setCustomers] = useState([]); // 상태를 추가하여 고객 데이터를 저장합니다.
  const dropdownButtonStyles = {
    backgroundColor: "#e0e0e0", // 연한 회색
    color: "black", // 글자색
    borderColor: "#b0b0b0", // 테두리 색
  };

  const dropdownItemStyles = {
    fontSize: "16px", // 2px 더 큰 글자 크기
    padding: "3px 3px", // 박스 크기 조절
  };

  useEffect(() => {
    // 데이터를 로드하는 함수를 정의합니다.
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://52.79.81.200:8080/v1/customers/latest",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error("Data loading error:", error.message);
      }
    };

    fetchData(); // 함수를 호출하여 데이터를 로드합니다.
  }, []);

  return (
    <div>
      <div className="Db_container">
        <Dbbar>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="Add_Btn">
              <Modal1 />
            </div>
            <DropdownButton
              id="dropdown-basic-button"
              size="sm"
              title="정렬기준"
              variant="secondary"
              style={dropdownButtonStyles}
            >
              <Dropdown.Item href="#/action-1" style={dropdownItemStyles}>
                최신순
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2" style={dropdownItemStyles}>
                지역별
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3" style={dropdownItemStyles}>
                나이대별
              </Dropdown.Item>
            </DropdownButton>
          </div>
          <div className="Db_content">
            <div>DB 분배일</div>
            <div>고객유형</div>
            <div>이름</div>
            <div>생년월일 (나이)</div>
            <div>연락처</div>
            <div>거주지</div>
            <>
              {/* 가져온 데이터를 화면에 출력합니다. */}
              {customers
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신 순으로 정렬합니다.
                .map((customer) => (
                  <React.Fragment key={customer.pk}>
                    <div>{customer.createdAt}</div>
                    <div>{customer.customerTypeString}</div>
                    <div>{customer.name}</div>
                    <div>
                      {customer.birth} 만 ({customer.age})세
                    </div>
                    <div>{customer.phone}</div>
                    <div>{customer.address}</div>
                  </React.Fragment>
                ))}
            </>
          </div>
        </Dbbar>
      </div>
    </div>
  );
};

export default Main;
