import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import Dbbar from "../components/Dbbar";
import CustomerDetail from "../components/CustomerDetail";
import CustomerInfo from "../components/CustomerInfo"; // Assuming you have this component
import CustomerHistory from "../components/CustomerHistory"; // Assuming you have this component
import EditModalD from "../components/Modal/EditModalD";
import HistoryModal from "../components/Modal/HistoryModal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Detail = ({}) => {
  const location = useLocation();
  const { customerPk } = location.state;
  const [customerSchedules, setCustomerSchedules] = useState({});
  const [customerData, setCustomerData] = useState(null);

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
    navigate("/main", { state: { selectedTab: "월별 고객", formattedDate } });
  };

  const handleAllCustomersClick = () => {
    navigate("/main", { state: { selectedTab: "전체" } });
  };

  const handleContractCompleteClick = () => {
    navigate("/main", { state: { selectedTab: "계약완료고객" } });
  };

  return (
    <div
      className="Detail_container"
      style={{
        display: "flex",
        backgroundColor: "#F5FAFF",
        width: "1400px",
        margin: "0 auto",
        borderRight: "2px solid #dde1e6",
      }}
    >
      <Navbar
        onContractCompleteClick={handleContractCompleteClick}
        onAllCustomersClick={handleAllCustomersClick}
        onMonthCustomersClick={handleMonthCustomersClick}
        ContractedCustomerClcik={handleContractCompleteClick}
        AllCustomersClick={handleAllCustomersClick}
      />
      <div
        className="Detail_content"
        style={{
          marginLeft: "52px",
          height: "110vh",
          userSelect: "none",
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
              className="Detail_hr"
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
            <hr
              className="Detail_hr Detail_hr2"
              style={{ width: "1020px", marginLeft: "12px" }}
            />
            <CustomerHistory data={customerSchedules} customerPk={customerPk} />
            <EditModalD
              show={showEditModalD}
              onHide={() => setShowEditModalD(false)}
              selectedCustomer={selectedCustomer}
              onUpdateSuccess={handleUpdateSuccess}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
