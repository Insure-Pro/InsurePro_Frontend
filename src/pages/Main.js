import axios from "../axiosConfig";
import React, { useState, useEffect } from "react";
import "../App.css";
import "../MainStyles.css";
import Navbar from "../components/Navbar";
import Dbbar from "../components/Dbbar";
import Modal1 from "../components/Modal/Modal";
import EditModal from "../components/Modal/EditModal";
import ContextMenu from "../components/Modal/ContextMenu";
import ExcelDownloadButton from "../components/ExcelDownloadButton";
import ExcelUploadModal from "../components/Modal/ExcelUploadModal";
import Pagination from "../components/Pagination";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";

const Main = () => {
  const [customers, setCustomers] = useState([]); // 상태를 추가하여 고객 데이터를 저장합니다.
  const [refresh, setRefresh] = useState(false); // 화면 새로고침을 위한 상태 추가
  const [activeType, setActiveType] = useState("All"); // 활성화된 고객유형 Main컴포넌트에서 관리
  const [selectedAge, setSelectedAge] = useState(""); // 선택된 나이 필터 추가
  const [selectedSort, setSelectedSort] = useState("All"); // 선택된 나이 필터 추가
  const [showOptions, setShowOptions] = useState(null); // ID of customer for which options should be shown
  const [selectedContractYn, setSelectedContractYn] = useState(null); // 계약 완료 여부 상태 추가
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");

  // State to keep track of the current selection
  const [currentSelection, setCurrentSelection] = useState("정렬기준");
  const [dropdownview, setDropdownview] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const { selectedTab } = location.state || {};

  const showSearch = useSelector((state) => state.search.showSearch);
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const add_icon = process.env.PUBLIC_URL + "/add_button.png";
  const dropdown = process.env.PUBLIC_URL + "/dropdown.png";
  const dropup = process.env.PUBLIC_URL + "/dropup.png";

  // Retrieve the login status from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (selectedTab) {
      switch (selectedTab) {
        case "전체":
          handleAllCustomersClick();
          break;
        case "계약완료고객":
          handleContractCompleteClick();
          break;
        case "월별 고객":
          if (formattedDate) {
            handleMonthCustomersClick(formattedDate);
          }
          break;
        case "로고":
          resetFiltersAndSort();
          break;
        // Add cases for other tabs if necessary
        default:
          // Default action
          break;
      }
    }
  }, [selectedTab, location]);

  const navigate = useNavigate();

  const handleCustomerClick = (customer) => {
    navigate("/detail", { state: { customerPk: customer.pk } });
  };

  const handleSortChange = (sortType) => {
    // 선택된 정렬 기준을 저장하고, 새로고침 상태 변경
    setSelectedSort(sortType);
    setCurrentSelection(sortType === "latest" ? "최신순" : sortType);
    // 정렬 버튼을 누를 때 'selectedAge'를 초기화합니다.
    setSelectedAge("");
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleAgeFilterChange = async (age) => {
    setSelectedAge(age); // 선택된 나이 필터 업데이트
    // Mapping age filter to display text
    const ageDisplayMap = {
      1020: "10-20대",
      3040: "30-40대",
      5060: "50-60대",
      7080: "70-80대",
    };
    setCurrentSelection(ageDisplayMap[age]);
    setRefresh((prevRefresh) => !prevRefresh); // 새로고침 상태 변경
  };

  const handleTypeChange = (type) => {
    setActiveType(type); // 선택된 유형 업데이트
  };

  const fetchData = async () => {
    let url;
    if (formattedDate) {
      url = `${MAIN_URL}/customers/latest/${formattedDate}-01`;
    } else if (selectedContractYn != null) {
      url = `${MAIN_URL}/customers/contractYn/${selectedContractYn}/latest`;
    } else if (selectedAge) {
      url = `${MAIN_URL}/customers/age/${selectedAge}`;
    } else {
      url =
        selectedSort === "latest"
          ? `${MAIN_URL}/customers/latest`
          : `${MAIN_URL}/customers/latest`;
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
    }
  };

  const handleDeleteClick = async (customer) => {
    try {
      const response = await axios.patch(
        `${MAIN_URL}/customer/${customer.pk}`,
        {
          delYn: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
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
    setActiveType("All");
    setSelectedSort("All");
    setFormattedDate(null);
  };

  const handleContractCompleteClick = () => {
    setSelectedContractYn(true); // 계약 완료 여부를 true로 설정
    setFormattedDate(null);
    setSelectedSort("");
  };

  // Dbbar에서 onMonthCustomersClick 함수 전달
  const handleMonthCustomersClick = (date) => {
    setSelectedContractYn(null);
    setFormattedDate(date);
    setSelectedSort("");
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setRefresh((prevRefresh) => !prevRefresh); // 모달이 닫힐 때 새로고침 상태 변경
    fetchData();
    setIsModalOpen(false);
    setShowModal(false); // 모달을 숨김
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
    setIsModalOpen(true);
    fetchData();
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedCustomer(null);
    setIsModalOpen(false);
    // 모달이 닫힐 때 Edit/Delete 옵션을 숨깁니다.
    setShowOptions(null);
    fetchData();
  };

  const handleRightClick = (e, customerId) => {
    e.preventDefault(); // 기본 우클릭 메뉴 차단
    setShowOptions((prevId) => (prevId === customerId ? null : customerId)); // 버튼 토글
  };

  const customerTypeColors = {
    OD: "var(--colorN-1)",
    AD: "var(--colorN-2)",
    CP: "var(--colorN-3)",
    CD: "var(--colorN-4)",
    JD: "var(--colorN-5)",
    H: "var(--colorN-6)",
    X: "var(--colorN-7)",
    Y: "var(--colorN-8)",
    Z: "var(--colorN-9)",
  };

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    xPos: 0,
    yPos: 0,
    customer: null,
  });

  const handleContextMenu = (event, customer) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      xPos: event.pageX,
      yPos: event.pageY,
      customer: customer,
    });
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
    setIsModalOpen(true);
    // Edit logic
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleDelete = async (customer) => {
    await handleDeleteClick(customer);
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () =>
      setContextMenu({ ...contextMenu, visible: false });
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  ////////////////////// 페이지네이션 ////////////////////////////
  // 페이지네이션을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 30;

  // 현재 페이지의 첫 번째 및 마지막 고객의 인덱스 계산
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  // 현재 페이지에 표시될 고객 데이터 슬라이싱
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer,
  );

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [shouldPaginate, setShouldPaginate] = useState(
    window.innerWidth <= 1700,
  );

  useEffect(() => {
    const handleResize = () => {
      setShouldPaginate(window.innerWidth <= 1700);
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
  ////////////////////// 페이지네이션 ////////////////////////////

  // const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showExcelUploadModal, setShowExcelUploadModal] = useState(false);

  const handleShowOptions = () => {
    setShowOptions(true);
  };

  const handleAddCustomer = () => {
    setShowOptions(false);
    setShowModal(true);
  };

  const handleAddCustomerWithExcel = () => {
    setShowOptions(false);
    setShowExcelUploadModal(true);
  };

  //로고 클릭시 모든 정렬기준 초기화 함수
  const resetFiltersAndSort = () => {
    setSelectedAge("");
    setActiveType("All");
    setSelectedSort("All");
    setSelectedContractYn(null);
    setCurrentSelection("정렬기준");
  };

  // 검색 결과를 초기화하는 함수
  const resetSearch = () => {
    fetchData(); // 전체 고객 목록을 다시 불러옴
  };

  // 검색 결과를 확인하고 메시지를 표시하는 로직
  const renderCustomerList = () => {
    if (displayCustomers.length === 0) {
      return <p class="mb-1 mt-3">일치하는 고객이 없습니다.</p>; // 고객이 없을 때 메시지 표시
    }

    return [...displayCustomers]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신 순으로 정렬합니다.
      .map((customer) => (
        <div
          key={customer.pk}
          data-id={customer.pk} // 추가한 data-id 속성
          onContextMenu={(e) => handleContextMenu(e, customer)}
        >
          <ListGroup
            className="mx-11 flex justify-center"
            key={customer.pk}
            onClick={() => handleCustomerClick(customer)}
          >
            <ListGroup.Item
              className={`listItemStyle listItem1 ${
                customer.contractYn
                  ? "listItemStyle-contract"
                  : "listItemStyle-noContract"
              }`}
            >
              {customer.registerDate}
            </ListGroup.Item>
            <ListGroup.Item
              className={` listItemStyle listItem2 ${
                customer.contractYn
                  ? "listItemStyle-contract"
                  : "listItemStyle-noContract"
              }`}
              style={{ color: customerTypeColors[customer.customerType] }}
            >
              {customer.customerType}
            </ListGroup.Item>
            <ListGroup.Item
              className={`listItemStyle listItem3 ${
                customer.contractYn
                  ? "listItemStyle-contract"
                  : "listItemStyle-noContract"
              }`}
            >
              {customer.name}
            </ListGroup.Item>
            <ListGroup.Item
              className={`listItemStyle listItem4 ${
                customer.contractYn
                  ? "listItemStyle-contract"
                  : "listItemStyle-noContract"
              }`}
            >
              만 {customer.age}세
            </ListGroup.Item>
            <ListGroup.Item
              className={`listItemStyle listItem5 ${
                customer.contractYn
                  ? "listItemStyle-contract"
                  : "listItemStyle-noContract"
              }`}
            >
              {customer.phone}
            </ListGroup.Item>
            <ListGroup.Item
              className={`listItemStyle listItem6 ${
                customer.contractYn
                  ? "listItemStyle-contract"
                  : "listItemStyle-noContract"
              }`}
            >
              {customer.dongString}
              {customer.address}
            </ListGroup.Item>
            <ListGroup.Item
              className={`listItemStyle listItem7 ${
                customer.contractYn
                  ? "listItemStyle-contract"
                  : "listItemStyle-noContract"
              }`}
            >
              {customer.memo}
            </ListGroup.Item>
          </ListGroup>
        </div>
      ));
  };

  return (
    <div style={{ width: "100vw" }}>
      <Navbar
        onContractCompleteClick={handleContractCompleteClick}
        onAllCustomersClick={handleAllCustomersClick}
        onMonthCustomersClick={handleMonthCustomersClick}
        setCustomers={setCustomers}
        resetFiltersAndSort={resetFiltersAndSort}
        resetSearch={resetSearch}
      />
      <Dbbar
        onTypeChange={handleTypeChange}
        onContractCompleteClick={handleContractCompleteClick}
        onAllCustomersClick={handleAllCustomersClick}
        onMonthCustomersClick={handleMonthCustomersClick}
        customers={customers}
        setFormattedDate={setFormattedDate}
        activeType={activeType} // activeType을 props로 전달합니다.
      />
      {showModal && <Modal1 show={showModal} onModalClose={handleModalClose} />}
      {showExcelUploadModal && (
        <ExcelUploadModal
          show={showExcelUploadModal}
          onModalClose={handleModalClose}
          onHide={() => setShowExcelUploadModal(false)}
        />
      )}
      {showOptions && (
        <div className="options-modal-style">
          <button onClick={handleAddCustomer}>신규 고객 추가</button>
          <button onClick={handleAddCustomerWithExcel}>엑셀파일로 추가</button>
        </div>
      )}
      <div
        className={`${
          showModal || showOptions || showExcelUploadModal || isModalOpen
            ? "blur-background no-interaction"
            : ""
        } flex  flex-col bg-LightMode-SectionBackground`}
        style={{
          clipPath: showSearch ? "inset(52px 0 0 0)" : "",
          marginTop: showSearch ? "-52px" : "",
        }}
      >
        <div class=" flex w-screen items-center justify-center pt-2">
          <div class="  flex h-[52px] items-center text-center">
            <button className="add_Btn" onClick={handleShowOptions}>
              <img src={add_icon} />
            </button>
            <ExcelDownloadButton
              customers={customers}
              activeType={activeType}
            />
          </div>
          <ul
            className="dropdown-container"
            onClick={() => {
              setDropdownview(!dropdownview);
            }}
          >
            {currentSelection}{" "}
            {dropdownview ? (
              <img className="dropdown-img" src={dropup} alt="Dropup" />
            ) : (
              <img className="dropdown-img" src={dropdown} alt="Dropdown" />
            )}
            {dropdownview && (
              <div className="dropdown-item">
                <li onClick={() => handleSortChange("latest")}>최신순</li>
                <li onClick={() => handleAgeFilterChange("1020")}>10-20대</li>
                <li onClick={() => handleAgeFilterChange("3040")}>30-40대</li>
                <li onClick={() => handleAgeFilterChange("5060")}>50-60대</li>
                <li onClick={() => handleAgeFilterChange("7080")}>70-80대</li>
              </div>
            )}
          </ul>
        </div>
        <div class="mx-12 mb-1 mt-3.5 flex  select-none justify-center">
          <div className="listItemTitleStyle listItem1">DB 분배일</div>
          <div className="listItemTitleStyle listItem2">고객유형</div>
          <div className="listItemTitleStyle listItem3">이름</div>
          <div className="listItemTitleStyle listItem4">나이</div>
          <div className="listItemTitleStyle listItem5">연락처</div>
          <div className="listItemTitleStyle listItem6">거주지</div>
          <div className="listItemTitleStyle listItem7">인수상태</div>
        </div>
        {/* 고객 목록 렌더링 */}
        <div>{renderCustomerList()}</div>
        {shouldPaginate && (
          <Pagination
            currentPage={currentPage}
            customersLength={customers.length}
            customersPerPage={customersPerPage}
            onPageChange={handlePageClick}
          />
        )}
        {contextMenu.visible && (
          <ContextMenu
            customer={contextMenu.customer}
            onEdit={handleEdit}
            onDelete={handleDelete}
            xPos={contextMenu.xPos}
            yPos={contextMenu.yPos}
            showMenu={contextMenu.visible}
          />
        )}
        {selectedCustomer && (
          <EditModal
            // className={setShowEditModal ? "blur-background no-interaction" : ""}
            show={showEditModal}
            onHide={handleEditModalClose}
            selectedCustomer={selectedCustomer}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
