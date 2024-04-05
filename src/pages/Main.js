import axios from "../axiosConfig";
import React, { useState, useEffect } from "react";
import "../App.css";
import "../MainStyles.css";
import Navbar from "../components/Main/Navbar";
import Dbbar from "../components/Main/Dbbar";
import Modal from "../components/Modal/Modal";
import EditModal from "../components/Modal/EditModal";
import ContextMenu from "../components/Modal/ContextMenu";
import ExcelDownloadButton from "../components/ExcelDownloadButton";
import ExcelUploadModal from "../components/Modal/ExcelUploadModal";
import CustomerList from "../components/Main/CustomerList";
import MobileCustomerList from "../components/Main/MobileCustomerList";
import Pagination from "../components/Main/Pagination";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import ListGroup from "react-bootstrap/ListGroup";
import { customerTypeColors } from "../constants/customerTypeColors";

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

  const isMobile = useMediaQuery({ query: "(max-width:960px)" });

  const location = useLocation();
  const { selectedTab } = location.state || {};

  const showSearch = useSelector((state) => state.search.showSearch);
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const add_icon = process.env.PUBLIC_URL + "/add_button.png";
  const dropdown = process.env.PUBLIC_URL + "/dropdown.png";
  const dropup = process.env.PUBLIC_URL + "/dropup.png";

  // Retrieve the login status from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  //-----------------------------------------------------------------------
  // Redux에서 현재 탭 상태 가져오기
  const currentTab = useSelector((state) => state.tabs.currentTab);

  useEffect(() => {
    // 현재 탭에 따른 로직 실행
    switch (currentTab) {
      case "전체":
        handleAllCustomersClick();
        break;
      case "월별 고객":
        // 필요한 경우 formattedDate 사용
        handleMonthCustomersClick(formattedDate);
        break;
      case "계약완료":
        handleContractCompleteClick();
        break;
      case "로고":
        resetFiltersAndSort();
        break;
      // 추가적인 케이스...
    }
  }, [currentTab]); // currentTab이 변경될 때마다 이 useEffect가 실행됩니다.
  //-----------------------------------------------------------------------

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
    setSelectedAge("");
    setSelectedSort("latest");
    setActiveType("All");
    // setSelectedSort("All");
    setSelectedContractYn(null);
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

  //로고 클릭시 모든 정렬기준 초기화 함수
  const resetFiltersAndSort = () => {
    setSelectedAge("");
    setSelectedSort("latest");
    setActiveType("All");
    setSelectedContractYn(null);
    setFormattedDate(null);
    setCurrentSelection("정렬기준");
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

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedCustomer(null);
    setIsModalOpen(false);
    // 모달이 닫힐 때 Edit/Delete 옵션을 숨깁니다.
    setShowOptions(null);
    fetchData();
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

  // 검색 결과를 초기화하는 함수
  const resetSearch = () => {
    fetchData(); // 전체 고객 목록을 다시 불러옴
  };

  return (
    <div style={{ width: "100vw" }}>
      <Navbar
        onMonthCustomersClick={handleMonthCustomersClick}
        setCustomers={setCustomers}
        resetFiltersAndSort={resetFiltersAndSort}
        resetSearch={resetSearch}
        setFormattedDate={setFormattedDate}
      />
      <Dbbar
        onTypeChange={handleTypeChange}
        customers={customers}
        activeType={activeType} // activeType을 props로 전달합니다.
      />
      {showModal && <Modal show={showModal} onModalClose={handleModalClose} />}
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
        } flex  min-h-[900px] flex-col ${
          isMobile ? "bg-white" : " bg-LightMode-SectionBackground"
        } `}
        style={
          {
            // clipPath: showSearch ? "inset(52px 0 0 0)" : "",
            // marginTop: showSearch ? "-52px" : "",
          }
        }
      >
        <div class=" flex w-screen items-center justify-center pt-2">
          <div
            class={`  flex h-[52px]  items-center text-center ${
              isMobile
                ? "xsm:ml-[-50px] xsm:w-[360px] float-left w-full sm:ml-[-90px] sm:w-[500px] md:ml-[-8px] md:w-[768px]"
                : ""
            }`}
          >
            <button className="add_Btn" onClick={handleShowOptions}>
              <img src={add_icon} />
            </button>
            <ExcelDownloadButton
              customers={customers}
              activeType={activeType}
            />
          </div>
          <ul
            className={`dropdown-container ${
              isMobile ? "hidden" : " ml-[764px] flex"
            }`}
            style={{ zIndex: "0" }}
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
        {isMobile ? (
          <MobileCustomerList
            customers={customers}
            handleCustomerClick={handleCustomerClick}
            handleContextMenu={handleContextMenu}
          />
        ) : (
          <CustomerList
            customers={displayCustomers}
            handleCustomerClick={handleCustomerClick}
            handleContextMenu={handleContextMenu}
          />
        )}
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
