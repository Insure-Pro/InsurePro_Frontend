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

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showEditModalD, setShowEditModalD] = useState(false);
  // HistoryModal이 열려 있는지 추적하는 새로운 상태
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(
    2,
    "0",
  )}`; // formattedDate 업데이트

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${MAIN_URL}/customer/${customerPk}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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
    <div>
      <Navbar
        onContractCompleteClick={handleContractCompleteClick}
        onAllCustomersClick={handleAllCustomersClick}
        onMonthCustomersClick={handleMonthCustomersClick}
        ContractedCustomerClcik={handleContractCompleteClick}
        AllCustomersClick={handleAllCustomersClick}
      />
      <div
        className={`${
          showEditModalD || isHistoryModalOpen
            ? "blur-background-detail no-interaction"
            : ""
        }  mx-auto h-screen w-full min-w-[1024px] select-none`}
      >
        {selectedCustomer && (
          <>
            <CustomerDetail
              data={selectedCustomer}
              customer={selectedCustomer}
              customerPk={customerPk}
              onUpdateSuccess={handleUpdateSuccess}
              showEditModal={showEditModalD}
              onEditClick={() => setShowEditModalD(true)} // Opens the modal
              onCloseModal={() => setShowEditModalD(false)} // Closes the modal
            />
            {/* <hr
              className="Detail_hr"
              style={{ width: "1020px", marginTop: "40px", marginLeft: "12px" }}
            /> */}
            <div>
              <CustomerInfo
                data={selectedCustomer}
                customer={selectedCustomer}
                customerPk={customerPk}
                onUpdateSuccess={handleUpdateSuccess}
                showEditModal={showEditModalD}
                onEditClick={() => setShowEditModalD(true)} // Opens the modal
                onCloseModal={() => setShowEditModalD(false)} // Closes the modal
              />
            </div>

            {/* <hr
              className="Detail_hr Detail_hr2"
              style={{ width: "1020px", marginLeft: "12px" }}
            /> */}
            <CustomerHistory
              data={customerSchedules}
              setIsHistoryModalOpen={setIsHistoryModalOpen}
              customerPk={customerPk}
            />
            {/* <EditModalD
              show={showEditModalD}
              onHide={() => setShowEditModalD(false)}
              selectedCustomer={selectedCustomer}
              onUpdateSuccess={handleUpdateSuccess}
            /> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
