import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import "../MainStyles.css";
import Dbbar from "../components/Dbbar";
import Modal1 from "../components/Modal";
import EditModal from "../components/EditModal";
import ExcelDownloadButton from "../components/ExcelDownloadButton";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import ListGroup from "react-bootstrap/ListGroup";

import { useSelector, useDispatch } from "react-redux";

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

  const dispatch = useDispatch();
  const location = useLocation();
  const { selectedTab } = location.state || {};

  useEffect(() => {
    if (selectedTab) {
      if (selectedTab === "월별 고객") {
        handleMonthCustomersClick();
      } else if (selectedTab === "전체") {
        handleAllCustomersClick();
      } else if (selectedTab === "계약완료고객") {
        handleContractCompleteClick();
      }
    }
  }, [selectedTab]);

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

  // 페이지네이션을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 15;

  // 현재 페이지의 첫 번째 및 마지막 고객의 인덱스 계산
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  // 현재 페이지에 표시될 고객 데이터 슬라이싱
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // '다음' 버튼 클릭 핸들러
  const handleNextClick = () => {
    const maxPage = Math.ceil(customers.length / customersPerPage);
    if (currentPage < maxPage) {
      const nextPage = Math.min(
        maxPage,
        currentPage + (5 - ((currentPage - 1) % 5))
      );
      setCurrentPage(nextPage);
    }
  };

  // '이전' 버튼 클릭 핸들러
  const handlePrevClick = () => {
    if (currentPage > 1) {
      // 현재 페이지 그룹의 첫 페이지를 계산 (5로 나눈 뒤 내림한 값에 5를 곱하고 1을 더함)
      const currentGroupStartPage = Math.floor((currentPage - 1) / 5) * 5 + 1;

      // 바로 이전 페이지 그룹의 첫 페이지를 찾기 위해 현재 그룹의 첫 페이지에서 5를 빼줌
      const newPage = currentGroupStartPage - 5;

      // 새 페이지가 1보다 작으면 1로 설정, 아니면 새 페이지 번호로 설정
      setCurrentPage(newPage < 1 ? 1 : newPage);
    }
  };
  const [shouldPaginate, setShouldPaginate] = useState(
    window.innerWidth <= 700
  );

  useEffect(() => {
    const handleResize = () => {
      setShouldPaginate(window.innerWidth <= 700);
    };

    // 창 크기가 변경될 때마다 handleResize 함수를 호출
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 화면의 가로 크기에 따라 사용할 배열 결정
  const displayCustomers = shouldPaginate ? currentCustomers : customers;

  // 페이지네이션 컴포넌트 렌더링
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(customers.length / customersPerPage); i++) {
      pageNumbers.push(i);
    }
    const startPage = 1 + 5 * Math.floor((currentPage - 1) / 5);
    const endPage = Math.min(startPage + 4, pageNumbers.length);

    return (
      <div className="pageNation_Btn">
        <button onClick={handlePrevClick} disabled={startPage === 1}>
          〈
        </button>
        {pageNumbers.slice(startPage - 1, endPage).map((number) => (
          <button
            style={{
              fontWeight: currentPage === number ? "bold" : "normal",
              color: "#175cd3",
            }}
            key={number}
            onClick={() => handlePageClick(number)}
          >
            {number}
          </button>
        ))}
        <button
          onClick={handleNextClick}
          disabled={endPage === pageNumbers.length}
        >
          〉
        </button>
      </div>
    );
  };

  return (
    <div
      className="Main_container"
      style={{ width: "1400px", margin: "0 auto" }}
    >
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
            className="Dbbar_hr "
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
              className="dropdownButtonStyles"
              size="ml"
              title="정렬기준"
              variant="secondary"
            >
              <Dropdown.Item
                href="#/action-1"
                className="customDropdownItemStyles1"
                onClick={() => handleSortChange("latest")}
              >
                최신순
              </Dropdown.Item>
              {/* <Dropdown.Item
                href="#/action-2"
                지역별
              </Dropdown.Item> */}
              <Dropdown.Item
                href="#/action-3"
                className="customDropdownItemStyles1"
                onClick={() => handleAgeFilterChange("1020")}
              >
                10-20대
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-4"
                className="customDropdownItemStyles1"
                onClick={() => handleAgeFilterChange("3040")}
              >
                30-40대
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-5"
                className="customDropdownItemStyles1"
                onClick={() => handleAgeFilterChange("5060")}
              >
                50-60대
              </Dropdown.Item>
              <Dropdown.Item
                href="#/action-6"
                className="customDropdownItemStyles1"
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
              userSelect: "none",
            }}
          >
            <ListGroup.Item variant="primary" className="listItemTitleStyle1">
              DB 분배일
            </ListGroup.Item>
            <ListGroup.Item variant="primary" className="listItemTitleStyle2">
              고객유형
            </ListGroup.Item>
            <ListGroup.Item variant="primary" className="listItemTitleStyle3">
              이름
            </ListGroup.Item>
            <ListGroup.Item variant="primary" className="listItemTitleStyle4">
              생년월일 (나이)
            </ListGroup.Item>
            <ListGroup.Item variant="primary" className="listItemTitleStyle5">
              연락처
            </ListGroup.Item>
            <ListGroup.Item variant="primary" className="listItemTitleStyle6">
              거주지
            </ListGroup.Item>
          </ListGroup>

          {/* <hr /> */}
          {[...displayCustomers]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신 순으로 정렬합니다.
            .map((customer) => (
              <div
                key={customer.pk}
                data-id={customer.pk} // 추가한 data-id 속성
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleRightClick(e, customer.pk);
                }}
              >
                <ListGroup
                  horizontal
                  key={customer.pk}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <ListGroup.Item
                    className={`listItemStyle1 ${
                      customer.contractYn
                        ? "listItemStyle1-contract"
                        : "listItemStyle1-noContract"
                    }`}
                  >
                    {customer.registerDate}
                  </ListGroup.Item>
                  <ListGroup.Item
                    className={`listItemStyle2 ${
                      customer.contractYn
                        ? "listItemStyle2-contract"
                        : "listItemStyle2-noContract"
                    }`}
                  >
                    {customer.customerType}
                  </ListGroup.Item>
                  <ListGroup.Item
                    className={`listItemStyle3 ${
                      customer.contractYn
                        ? "listItemStyle3-contract"
                        : "listItemStyle3-noContract"
                    }`}
                  >
                    {customer.name}
                  </ListGroup.Item>
                  <ListGroup.Item
                    className={`listItemStyle4 ${
                      customer.contractYn
                        ? "listItemStyle4-contract"
                        : "listItemStyle4-noContract"
                    }`}
                  >
                    {customer.birth} (만 {customer.age}세)
                  </ListGroup.Item>
                  <ListGroup.Item
                    className={`listItemStyle5 ${
                      customer.contractYn
                        ? "listItemStyle5-contract"
                        : "listItemStyle5-noContract"
                    }`}
                  >
                    {customer.phone}
                  </ListGroup.Item>
                  <ListGroup.Item
                    className={`listItemStyle6 ${
                      customer.contractYn
                        ? "listItemStyle6-contract"
                        : "listItemStyle6-noContract"
                    }`}
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
          {shouldPaginate && renderPagination()}
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
