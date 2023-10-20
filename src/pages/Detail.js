import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";

import CustomerDetail from "../components/CustomerDetail";
import CustomerInfo from "../components/CustomerInfo"; // Assuming you have this component
import CustomerHistory from "../components/CustomerHistory"; // Assuming you have this component
import EditModalD from "../components/EditModalD";
import HistoryModal from "../components/HistoryModal";
import { useLocation } from "react-router-dom";

const Detail = () => {
  const location = useLocation();
  const { customerPk } = location.state;
  const [customerDetail, setCustomerDetail] = useState({});
  const [customerSchedules, setCustomerSchedules] = useState({});
  const [customerData, setCustomerData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModalD, setShowEditModalD] = useState(false);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const response = await axios.get(
          `https://www.insurepro.kro.kr/v1/customer/${customerPk}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setCustomerDetail(response.data);
      } catch (error) {
        console.error("Error fetching customer detail:", error);
      }
    };

    const fetchCustomerSchedules = async () => {
      try {
        const response = await axios.get(
          `https://www.insurepro.kro.kr/v1/schedules/${customerPk}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setCustomerSchedules(response.data);
      } catch (error) {
        console.error("Error fetching customer schedules:", error);
      }
    };

    fetchCustomerDetail();
    fetchCustomerSchedules();
  }, [customerPk]);

  const fetchData = async () => {
    try {
      // // 예시 API URL과 헤더입니다. 실제 값을 사용해야 합니다.
      // const apiUrl = "http://your-api-url";
      // const headers = { Authorization: `Bearer your-access-token` };

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
      <Navbar />
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
