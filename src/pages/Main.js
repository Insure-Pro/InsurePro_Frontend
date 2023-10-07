import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Dbbar from "../components/Dbbar";
import Modal1 from "../components/Modal";
import EditModal from "../components/EditModal";

import ExcelDownloadButton from "../components/ExcelDownloadButton";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import ListGroup from "react-bootstrap/ListGroup";

const Main = () => {
  const [customers, setCustomers] = useState([]); // 상태를 추가하여 고객 데이터를 저장합니다.
  const [refresh, setRefresh] = useState(false); // 화면 새로고침을 위한 상태 추가
  const [activeType, setActiveType] = useState("All"); // 선택된 유형 상태 추가
  const [selectedAge, setSelectedAge] = useState(""); // 선택된 나이 필터 추가
  const [selectedSort, setSelectedSort] = useState("All"); // 선택된 나이 필터 추가
  const [showOptions, setShowOptions] = useState(null); // ID of customer for which options should be shown

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dropdownButtonStyles = {
    backgroundColor: "#e0e0e0", // 연한 회색
    color: "black", // 글자색
    borderColor: "#b0b0b0", // 테두리 색
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
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
    width: "170px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderRightRadius: "20px",
    borderRadius: "5px",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.10)",
    // borderRadius: "0 5px 5px 0",//오른쪽 모서리
  };
  //고객유형
  const listItemStyle2 = {
    flex: "none", // flex 속성 제거
    width: "110px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.10)",
  };
  //이름
  const listItemStyle3 = {
    flex: "none", // flex 속성 제거
    width: "110px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.10)",
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
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.10)",
  };
  //연락처
  const listItemStyle5 = {
    flex: "none", // flex 속성 제거
    width: "170px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.10)",
  };
  //거주지
  const listItemStyle6 = {
    flex: "none", // flex 속성 제거
    width: "230px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.10)",
    // borderRadius: "5px 0 0 5px",// 왼쪽모서리
  };
  const listItemTitleStyle1 = {
    flex: "none", // flex 속성 제거
    width: "170px",
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
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
  };
  const listItemTitleStyle2 = {
    flex: "none", // flex 속성 제거
    width: "110px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
    color: "#FFF",
    backgroundColor: "#175CD3",
    opacity: "0.9",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
  };
  const listItemTitleStyle3 = {
    flex: "none", // flex 속성 제거
    width: "110px",
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
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
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
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
  };
  const listItemTitleStyle5 = {
    flex: "none", // flex 속성 제거
    width: "170px",
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
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
  };
  const listItemTitleStyle6 = {
    flex: "none", // flex 속성 제거
    width: "230px",
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
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
  };

  const navigate = useNavigate();

  const handleCustomerClick = (customer) => {
    navigate("/detail", { state: { customerPk: customer.pk } });
  };

  const handleSortChange = (sortType) => {
    // 선택된 정렬 기준을 저장하고, 새로고침 상태 변경
    setSelectedSort(sortType);
    // 정렬 버튼을 누를 때 'selectedAge'를 초기화합니다.
    setSelectedAge("");
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleAgeFilterChange = async (age) => {
    setSelectedAge(age); // 선택된 나이 필터 업데이트
    setRefresh((prevRefresh) => !prevRefresh); // 새로고침 상태 변경
  };

  const handleTypeChange = (type) => {
    setActiveType(type); // 선택된 유형 업데이트
  };
  let pressTimer;

  const fetchData = async () => {
    let url;
    if (selectedAge) {
      url = `http://3.38.101.62:8080/v1/customers/age/${selectedAge}`;
    } else {
      url =
        selectedSort === "latest"
          ? "http://3.38.101.62:8080/v1/customers/latest"
          : "http://3.38.101.62:8080/v1/customers/latest";
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        const filteredCustomers = response.data.filter((customer) => {
          if (activeType === "All") {
            return true;
          }
          return customer.customerTypeString === activeType;
        });
        setCustomers(filteredCustomers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh, selectedAge, selectedSort, activeType]); // refresh, activeType, selectedAge가 변경될 때마다 데이터 다시 불러옵니다.

  const handleModalClose = () => {
    setRefresh((prevRefresh) => !prevRefresh); // 모달이 닫힐 때 새로고침 상태 변경
    fetchData();
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
    fetchData();
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedCustomer(null);
    fetchData();
    // Refresh customer data, if needed
  };

  const handleMouseDown = (customerId) => {
    pressTimer = setTimeout(() => {
      setShowOptions(customerId);
    }, 1000);
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer);
  };

  return (
    <div style={{ width: "1400px", margin: "0 auto" }}>
      <div className="Db_container">
        <Dbbar onTypeChange={handleTypeChange}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "13px",
            }}
          >
            <div className="Add_Btn">
              <Modal1 onModalClose={handleModalClose} />
              <ExcelDownloadButton
                customers={customers}
                activeType={activeType}
              />
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
                onClick={() => handleSortChange("latest")}
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
                onClick={() => handleAgeFilterChange("1020")}
              >
                10-20대
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-4"
                style={customDropdownItemStyles1}
                onClick={() => handleAgeFilterChange("3040")}
              >
                30-40대
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-5"
                style={customDropdownItemStyles1}
                onClick={() => handleAgeFilterChange("5060")}
              >
                50-60대
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-6"
                style={customDropdownItemStyles1}
                onClick={() => handleAgeFilterChange("7080")}
              >
                70-80대
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
              <div
                key={customer.pk}
                onMouseDown={() => handleMouseDown(customer.pk)}
                onMouseUp={handleMouseUp}
                onTouchStart={() => handleMouseDown(customer.pk)}
                onTouchEnd={handleMouseUp}
              >
                <ListGroup
                  horizontal
                  key={customer.pk}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <ListGroup.Item
                    style={{
                      ...listItemStyle1,
                      // backgroundColor: customer.contractYn
                      //   ? "#4FFA7A"
                      //   : "transparent",
                      border: customer.contractYn
                        ? "1px solid #53B1FD"
                        : "1px solid #DDDDDD",
                    }}
                  >
                    {customer.registerDate}
                  </ListGroup.Item>
                  <ListGroup.Item
                    style={{
                      ...listItemStyle2,
                      border: customer.contractYn
                        ? "1px solid #53B1FD"
                        : "1px solid #DDDDDD",
                    }}
                  >
                    {customer.customerTypeString}
                  </ListGroup.Item>
                  <ListGroup.Item
                    style={{
                      ...listItemStyle3,
                      border: customer.contractYn
                        ? "1px solid #53B1FD"
                        : "1px solid #DDDDDD",
                    }}
                  >
                    {customer.name}
                  </ListGroup.Item>
                  <ListGroup.Item
                    style={{
                      ...listItemStyle4,
                      border: customer.contractYn
                        ? "1px solid #53B1FD"
                        : "1px solid #DDDDDD",
                    }}
                  >
                    {customer.birth} 만 {customer.age}세
                  </ListGroup.Item>
                  <ListGroup.Item
                    style={{
                      ...listItemStyle5,
                      border: customer.contractYn
                        ? "1px solid #53B1FD"
                        : "1px solid #DDDDDD",
                    }}
                  >
                    {customer.phone}
                  </ListGroup.Item>
                  <ListGroup.Item
                    style={{
                      ...listItemStyle6,
                      border: customer.contractYn
                        ? "1px solid #53B1FD"
                        : "1px solid #DDDDDD",
                    }}
                  >
                    {customer.address}
                  </ListGroup.Item>
                </ListGroup>
                {showOptions === customer.pk && (
                  <div>
                    <button onClick={() => handleEditClick(customer)}>
                      Edit
                    </button>
                    <button>Delete</button>
                  </div>
                )}
              </div>
            ))}
          {selectedCustomer && (
            <EditModal
              show={showEditModal}
              onHide={handleEditModalClose}
              selectedCustomer={selectedCustomer}
              onClose={handleModalClose}
            />
          )}
        </Dbbar>
      </div>
    </div>
  );
};

export default Main;
