import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";
import Dbbar from "../components/Dbbar";
import CustomerDetail from "../components/CustomerDetail";
import CustomerInfo from "../components/CustomerInfo"; // Assuming you have this component
import CustomerHistory from "../components/CustomerHistory"; // Assuming you have this component
import EditModalD from "../components/EditModalD";
import HistoryModal from "../components/HistoryModal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setCustomers,
  setActiveType,
  setSelectedAge,
  setSelectedSort,
  setShowOptions,
  setSelectedContractYn,
  setShowEditModal,
  setSelectedCustomer,
  setFormattedDate,
  setSelectedTab,
} from "../redux/customerSlice";

const Detail = ({
  onAllCustomersClick,
  onContractCompleteClick,
  onMonthCustomersClick,
  children,
  onTypeChange,
  setCustomers,
}) => {
  const location = useLocation();
  const { customerPk } = location.state;
  const [customerDetail, setCustomerDetail] = useState({});
  const [customerSchedules, setCustomerSchedules] = useState({});
  const [customerData, setCustomerData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTab, setSelectedTab] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModalD, setShowEditModalD] = useState(false);

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(
    2,
    "0"
  )}`; // formattedDate 업데이트

  // useEffect(() => {
  //   const fetchCustomerDetail = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://www.insurepro.kro.kr/v1/customer/${customerPk}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         }
  //       );
  //       setCustomerDetail(response.data);
  //     } catch (error) {
  //       console.error("Error fetching customer detail:", error);
  //     }
  //   };

  //   const fetchCustomerSchedules = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://www.insurepro.kro.kr/v1/schedules/${customerPk}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         }
  //       );
  //       setCustomerSchedules(response.data);
  //     } catch (error) {
  //       console.error("Error fetching customer schedules:", error);
  //     }
  //   };

  //   fetchCustomerDetail();
  //   fetchCustomerSchedules();
  // }, [customerPk]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://www.insurepro.kro.kr/v1/schedules/${customerPk}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setCustomerData(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchData(); // 데이터 변경 후, fetchData를 호출하여 화면을 업데이트합니다.
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `https://www.insurepro.kro.kr/v1/customer/${customerPk}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data) {
        setSelectedCustomer(response.data);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerPk]);

  const handleEditClick = () => {
    setShowEditModalD(true);
  };

  const handleUpdateSuccess = (updatedCustomer) => {
    try {
      setSelectedCustomer(updatedCustomer);
    } catch (error) {
      console.error("Error in handleUpdateSuccess:", error);
    }
  };

  const handleMonthCustomersClick = () => {
    setSelectedTab("월별 고객"); // 계약 완료 여부를 true로 설정
    // navigate("/main"); // 예시로 Main 페이지로 리다이렉트
    // fetchData(); // 데이터를 다시 불러옴
  };
  const handleAllCustomersClick = () => {
    setSelectedTab("전체");
    // navigate("/main"); // 예시로 Main 페이지로 리다이렉트
  };

  const handleContractCompleteClick = () => {
    setSelectedTab("계약완료고객");
    // navigate("/main"); // 예시로 Main 페이지로 리다이렉트
  };

  const handleFormattedDateClick = () => {
    if (selectedTab === "월별 고객") {
      setIsModalOpen(true);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F5FAFF",
        width: "1400px",
        margin: "0 auto",
        borderRight: "2px solid #dde1e6",
      }}
    >
      {/* <Dbbar
        onAllCustomersClick={handleAllCustomersClick}
        onContractCompleteClick={handleContractCompleteClick}
        onMonthCustomersClick={handleMonthCustomersClick}
        // ... 다른 필요한 props들
      /> */}
      <Navbar
        onContractCompleteClick={onContractCompleteClick}
        onAllCustomersClick={onAllCustomersClick}
        onMonthCustomersClick={() => {
          handleMonthCustomersClick();
          // Here, we will pass the formattedDate value to the function in Main.js
          onMonthCustomersClick(formattedDate);
        }}
        ContractedCustomerClcik={handleContractCompleteClick}
        AllCustomersClick={handleAllCustomersClick}
      />
      <div
        style={{
          marginLeft: "302px",
          height: "110vh",
        }}
      >
        {selectedCustomer && (
          <>
            <CustomerDetail
              data={selectedCustomer}
              customer={selectedCustomer}
              onEditClick={handleEditClick}
              customerPk={customerPk}
              onUpdateSuccess={handleUpdateSuccess}
            />
            <hr
              style={{ width: "1020px", marginTop: "40px", marginLeft: "12px" }}
            />
            <div style={{ display: "flex" }}>
              <CustomerInfo
                data={selectedCustomer}
                customer={selectedCustomer}
                customerPk={customerPk}
                onUpdateSuccess={handleUpdateSuccess}
              />
            </div>
            <hr style={{ width: "1020px", marginLeft: "12px" }} />
            <CustomerHistory data={customerSchedules} customerPk={customerPk} />
            <EditModalD
              show={showEditModalD}
              onHide={() => setShowEditModalD(false)}
              selectedCustomer={selectedCustomer}
              onUpdateSuccess={handleUpdateSuccess}
              // isOpen={isModalOpen}
              // onClose={handleModalClose}
              // data={customerData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
