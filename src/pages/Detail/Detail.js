import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../../App.css";
import "../Detail/Detail.css";
import Navbar from "../../components/Main/Navbar/Navbar";
import CustomerDetail from "../../components/Detail/CustomerDetail";
import CustomerInfo from "../../components/Detail/CustomerInfo";
import CustomerHistory from "../../components/Detail/CustomerHistory";
import { useLocation } from "react-router-dom";

const Detail = ({}) => {
  const location = useLocation();
  const { customerPk } = location.state;
  const [customerSchedules, setCustomerSchedules] = useState({});

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showEditModalD, setShowEditModalD] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

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

  const handleUpdateSuccess = (updatedCustomer) => {
    try {
      setSelectedCustomer(updatedCustomer);
    } catch (error) {
      console.error("Error in handleUpdateSuccess:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className={` ${
          showEditModalD || isHistoryModalOpen
            ? "blur-background-detail no-interaction "
            : ""
        }  mx-auto h-screen w-full min-w-[1024px] select-none`}
      >
        {selectedCustomer && (
          <>
            <CustomerDetail
              data={selectedCustomer}
              customerPk={customerPk}
              onUpdateSuccess={handleUpdateSuccess}
              showEditModal={showEditModalD}
              onEditClick={() => setShowEditModalD(true)}
              onCloseModal={() => setShowEditModalD(false)}
            />
            <div>
              <CustomerInfo
                data={selectedCustomer}
                customerPk={customerPk}
                onUpdateSuccess={handleUpdateSuccess}
                showEditModal={showEditModalD}
                onEditClick={() => setShowEditModalD(true)}
                onCloseModal={() => setShowEditModalD(false)}
              />
            </div>

            <CustomerHistory
              data={customerSchedules}
              customerPk={customerPk}
              setIsHistoryModalOpen={setIsHistoryModalOpen}
              onEditClick={() => setIsHistoryModalOpen(true)}
              onCloseModal={() => setIsHistoryModalOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
