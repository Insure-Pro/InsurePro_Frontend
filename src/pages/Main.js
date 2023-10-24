import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import Dbbar from "../components/Dbbar";
import Modal1 from "../components/Modal";
import EditModal from "../components/EditModal";
import ExcelDownloadButton from "../components/ExcelDownloadButton";
import { useNavigate } from "react-router-dom";
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
  const [selectedContractYn, setSelectedContractYn] = useState(null); // 계약 완료 여부 상태 추가
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");

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
    cursor: "default",
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
    cursor: "default",
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
    cursor: "default",
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
    cursor: "default",
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
    cursor: "default",
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
    cursor: "default",
    whiteSpace: "nowrap", // 텍스트가 넘칠 경우 줄 바꿈을 방지합니다.
    overflow: "hidden", // 내용이 넘칠 경우 숨깁니다.
    textOverflow: "ellipsis", // 내용이 넘칠 경우 생략 부호(...)를 표시합니다.
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
    fontWeight: "bold",
    opacity: "0.9",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
    cursor: "default",
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
    fontWeight: "bold",
    opacity: "0.9",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
    cursor: "default",
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
    fontWeight: "bold",
    opacity: "0.9",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
    cursor: "default",
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
    fontWeight: "bold",
    opacity: "0.9",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
    cursor: "default",
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
    fontWeight: "bold",
    opacity: "0.9",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
    cursor: "default",
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
    fontWeight: "bold",
    opacity: "0.9",
    boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)",
    cursor: "default",
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

  const fetchData = async () => {
    let url;
    if (formattedDate) {
      url = `https://www.insurepro.kro.kr/v1/customers/latest/${formattedDate}-01`;
    } else if (selectedContractYn != null) {
      url = `https://www.insurepro.kro.kr/v1/customers/contractYn/${selectedContractYn}/latest`;
    } else if (selectedAge) {
      url = `https://www.insurepro.kro.kr/v1/customers/age/${selectedAge}`;
    } else {
      url =
        selectedSort === "latest"
          ? "https://www.insurepro.kro.kr/v1/customers/latest"
          : "https://www.insurepro.kro.kr/v1/customers/latest";
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
          return customer.customerType === activeType;
        });
        setCustomers(filteredCustomers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error.message);
      // console.log(formattedDate);
    }
  };

  const handleDeleteClick = async (customer) => {
    try {
      const response = await axios.patch(
        `https://www.insurepro.kro.kr/v1/customer/${customer.pk}`,
        {
          delYn: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200) {
        // 이 곳에서 추가적인 작업 (상태 업데이트, UI 변경 등)을 수행할 수 있습니다.
        fetchData(); // 수정된 데이터를 다시 불러옵니다.
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh, selectedAge, selectedSort, activeType, formattedDate]); // refresh, activeType, selectedAge가 변경될 때마다 데이터 다시 불러옵니다.

  const handleAllCustomersClick = () => {
    setSelectedContractYn(null);
    setSelectedAge("");
    setSelectedSort("latest");
    setFormattedDate(null);
    fetchData(); // 데이터를 다시 불러옴
  };

  const handleContractCompleteClick = () => {
    setSelectedContractYn(true); // 계약 완료 여부를 true로 설정
    setFormattedDate(null);
    fetchData(); // 데이터를 다시 불러옴
  };

  // Dbbar에서 onMonthCustomersClick 함수 전달
  const handleMonthCustomersClick = (date) => {
    setFormattedDate(date);
    fetchData();
  };

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
    // 모달이 닫힐 때 Edit/Delete 옵션을 숨깁니다.
    setShowOptions(null);
    fetchData();
    // Refresh customer data, if needed
  };

  const handleRightClick = (e, customerId) => {
    e.preventDefault(); // 기본 우클릭 메뉴 차단
    setShowOptions((prevId) => (prevId === customerId ? null : customerId)); // 버튼 토글
  };

  // let pressTimer;
  // let longPressTriggered = false; // 길게 눌렸는지 확인하는 플래그를 추가

  // const handleMouseDown = (customerId) => {
  //   longPressTriggered = false; // 초기화
  //   pressTimer = setTimeout(() => {
  //     setShowOptions(customerId); // 1초 후에 Edit, Delete 버튼을 보여줍니다.
  //     longPressTriggered = true; // 길게 눌렸다는 것을 표시
  //   }, 1000);
  // };

  // const handleMouseUp = (customer) => {
  //   clearTimeout(pressTimer);
  //   // 만약 longPressTriggered가 false이면 (즉, 길게 누르지 않은 상태에서 MouseUp 이벤트가 발생하면)
  //   if (!longPressTriggered) {
  //     // 약간의 딜레이를 주어 setShowOptions에서의 상태 업데이트가 handleCustomerClick 호출보다 먼저 발생하도록 합니다.
  //     setTimeout(() => {
  //       if (!showOptions) {
  //         handleCustomerClick(customer);
  //       }
  //     }, 50);
  //   }
  //   // 길게 눌렸든, 길게 눌리지 않았든, 상태를 초기화
  //   longPressTriggered = false;
  // };

  return (
    <div style={{ width: "1400px", margin: "0 auto" }}>
      <div className="Db_container">
        <Dbbar
          onTypeChange={handleTypeChange}
          onContractCompleteClick={handleContractCompleteClick}
          onAllCustomersClick={handleAllCustomersClick}
          onMonthCustomersClick={handleMonthCustomersClick}
          customers={customers}
          setCustomers={setCustomers}
          setFormattedDate={setFormattedDate}
        >
          {/* <Search setCustomers={setCustomers} /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "37px",
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
              {/* <Dropdown.Item
                href="#/action-2"
                style={customDropdownItemStyles1}
              >
                지역별
              </Dropdown.Item> */}
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
            style={{
              marginTop: "12px",
              marginBottom: "-10px",
              marginBottom: "4px",
            }}
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
          {/* <hr /> */}
          {/* 가져온 데이터를 화면에 출력합니다. */}
          {customers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신 순으로 정렬합니다.
            .map((customer) => (
              <div
                key={customer.pk}
                data-id={customer.pk} // 추가한 data-id 속성
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleRightClick(e, customer.pk);
                }}
                // onMouseDown={() => handleMouseDown(customer.pk)}
                // onMouseUp={() => handleMouseUp(customer)}
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
                    {customer.customerType}
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
                    {customer.birth} (만 {customer.age}세)
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
                    <Button
                      variant="outline-primary"
                      onClick={() => handleEditClick(customer)}
                      style={{
                        fontSize: "14px",
                        // fontWeight: "bold",
                        height: "36px",
                        marginBottom: "6px",
                        boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.15)",
                      }}
                    >
                      수정
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDeleteClick(customer)}
                      style={{
                        fontSize: "14px",
                        // fontWeight: "bold",
                        height: "36px",
                        marginBottom: "6px",
                        boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.15)",
                      }}
                    >
                      삭제
                    </Button>{" "}
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
