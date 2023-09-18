import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Dbbar from "../components/Dbbar";
import Modal1 from "../components/Modal";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import ListGroup from "react-bootstrap/ListGroup";

const Main = () => {
  const [customers, setCustomers] = useState([]); // 상태를 추가하여 고객 데이터를 저장합니다.
  const [refresh, setRefresh] = useState(false); // 화면 새로고침을 위한 상태 추가
  const [activeType, setActiveType] = useState("All"); // 선택된 유형 상태 추가

  const dropdownButtonStyles = {
    backgroundColor: "#e0e0e0", // 연한 회색
    color: "black", // 글자색
    borderColor: "#b0b0b0", // 테두리 색
  };

  const customDropdownItemStyles1 = {
    width: "100px", // 원하는 너비로 설정합니다.
    paddingLeft: "30px",
    // whiteSpace: "nowrap", // 텍스트가 넘칠 경우 줄 바꿈을 방지합니다.
    // overflow: "hidden", // 내용이 넘칠 경우 숨깁니다.
    // textOverflow: "ellipsis", // 내용이 넘칠 경우 생략 부호(...)를 표시합니다.
  };
  //DB분배일
  const listItemStyle1 = {
    flex: "none", // flex 속성 제거
    width: "270px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderRightRadius: "20px",
    borderRadius: "5px",
    // borderRadius: "0 5px 5px 0",//오른쪽 모서리
  };
  //고객유형
  const listItemStyle2 = {
    flex: "none", // flex 속성 제거
    width: "90px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
  };
  //이름
  const listItemStyle3 = {
    flex: "none", // flex 속성 제거
    width: "70px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
  };
  //생년월일(나이)
  const listItemStyle4 = {
    flex: "none", // flex 속성 제거
    width: "200px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
  };
  //연락처
  const listItemStyle5 = {
    flex: "none", // flex 속성 제거
    width: "150px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
  };
  //거주지
  const listItemStyle6 = {
    flex: "none", // flex 속성 제거
    width: "250px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    // borderRadius: "5px 0 0 5px",// 왼쪽모서리
  };
  const listItemTitleStyle1 = {
    flex: "none", // flex 속성 제거
    width: "270px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderRightRadius: "20px",
    borderRadius: "5px",
    border: "none",
    color: "#FFF",
    backgroundColor: "#175CD3",
    opacity: "0.9",
  };
  const listItemTitleStyle2 = {
    flex: "none", // flex 속성 제거
    width: "90px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    color: "#FFF",
    backgroundColor: "#175CD3",
    opacity: "0.9",
  };
  const listItemTitleStyle3 = {
    flex: "none", // flex 속성 제거
    width: "70px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    border: "none",
    color: "#FFF",
    backgroundColor: "#175CD3",
    opacity: "0.9",
  };
  const listItemTitleStyle4 = {
    flex: "none", // flex 속성 제거
    width: "200px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    border: "none",
    color: "#FFF",
    backgroundColor: "#175CD3",
    opacity: "0.9",
  };
  const listItemTitleStyle5 = {
    flex: "none", // flex 속성 제거
    width: "150px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    border: "none",
    color: "#FFF",
    backgroundColor: "#175CD3",
    opacity: "0.9",
  };
  const listItemTitleStyle6 = {
    flex: "none", // flex 속성 제거
    width: "250px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    border: "none",
    color: "#FFF",
    backgroundColor: "#175CD3",
    opacity: "0.9",
  };

  const handleTypeChange = (type) => {
    setActiveType(type); // 선택된 유형 업데이트
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
          // 선택된 유형에 따라 필터링된 데이터만 저장
          const filteredCustomers = response.data.filter((customer) => {
            if (activeType === "All") {
              return true; // 모든 유형을 표시하려면 모든 데이터를 반환
            } else {
              return customer.customerTypeString === activeType;
            }
          });
          setCustomers(filteredCustomers);
        }
      } catch (error) {
        console.error("Data loading error:", error.message);
      }
    };
    fetchData();
  }, [refresh, activeType]); // refresh 상태 또는 activeType이 변경될 때마다 데이터 다시 불러옵니다.

  const handleModalClose = () => {
    setRefresh((prevRefresh) => !prevRefresh); // 모달이 닫힐 때 새로고침 상태 변경
  };

  return (
    <div>
      <div className="Db_container">
        <Dbbar onTypeChange={handleTypeChange}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="Add_Btn">
              <Modal1 onModalClose={handleModalClose} />
            </div>
            <DropdownButton
              id="dropdown-basic-button"
              size="ml"
              title="정렬기준"
              variant="secondary"
              style={dropdownButtonStyles}
            >
              <Dropdown.Item
                href="#/action-1"
                style={customDropdownItemStyles1}
              >
                최신순
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-2"
                style={customDropdownItemStyles1}
              >
                지역별
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-3"
                style={customDropdownItemStyles1}
              >
                나이대별
              </Dropdown.Item>
            </DropdownButton>
          </div>
          <ListGroup
            horizontal
            style={{ marginTop: "12px", marginBottom: "-10px" }}
          >
            <ListGroup.Item variant="primary" style={listItemTitleStyle1}>
              DB 분배일
            </ListGroup.Item>
            <ListGroup.Item variant="primary" style={listItemTitleStyle2}>
              고객유형
            </ListGroup.Item>
            <ListGroup.Item variant="primary" style={listItemTitleStyle3}>
              이름
            </ListGroup.Item>
            <ListGroup.Item variant="primary" style={listItemTitleStyle4}>
              생년월일 (나이)
            </ListGroup.Item>
            <ListGroup.Item variant="primary" style={listItemTitleStyle5}>
              연락처
            </ListGroup.Item>
            <ListGroup.Item variant="primary" style={listItemTitleStyle6}>
              거주지
            </ListGroup.Item>
          </ListGroup>
          <hr />
          {/* 가져온 데이터를 화면에 출력합니다. */}
          {customers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신 순으로 정렬합니다.
            .map((customer) => (
              <ListGroup horizontal key={customer.pk}>
                <ListGroup.Item
                  style={{
                    ...listItemStyle1,
                    backgroundColor: customer.contractYn
                      ? "#4FFA7A"
                      : "transparent",
                  }}
                >
                  {customer.registerDate}
                </ListGroup.Item>
                <ListGroup.Item
                  style={{
                    ...listItemStyle2,
                    backgroundColor: customer.contractYn
                      ? "#4FFA7A"
                      : "transparent",
                  }}
                >
                  {customer.customerTypeString}
                </ListGroup.Item>
                <ListGroup.Item
                  style={{
                    ...listItemStyle3,
                    backgroundColor: customer.contractYn
                      ? "#4FFA7A"
                      : "transparent",
                  }}
                >
                  {customer.name}
                </ListGroup.Item>
                <ListGroup.Item
                  style={{
                    ...listItemStyle4,
                    backgroundColor: customer.contractYn
                      ? "#4FFA7A"
                      : "transparent",
                  }}
                >
                  {customer.birth} 만{customer.age}세
                </ListGroup.Item>
                <ListGroup.Item
                  style={{
                    ...listItemStyle5,
                    backgroundColor: customer.contractYn
                      ? "#4FFA7A"
                      : "transparent",
                  }}
                >
                  {customer.phone}
                </ListGroup.Item>
                <ListGroup.Item
                  style={{
                    ...listItemStyle6,
                    backgroundColor: customer.contractYn
                      ? "#4FFA7A"
                      : "transparent",
                  }}
                >
                  {customer.address}
                </ListGroup.Item>
              </ListGroup>
            ))}
          ;
        </Dbbar>
      </div>
    </div>
  );
};

export default Main;
