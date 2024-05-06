import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../../App.css";
import "../Detail/Detail.css";
import Navbar from "../../components/Main/Navbar/Navbar";
import CustomerDetail from "../../components/Detail/CustomerDetail";
import CustomerHistory from "../../components/Detail/CustomerHistory";
import CustomerTaHistory from "../../components/Detail/CustomerTaHistory";
import { useLocation } from "react-router-dom";

const Detail = ({}) => {
  const location = useLocation();
  const { customerPk } = location.state;
  // const [customerSchedules, setCustomerSchedules] = useState({});

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showEditModalD, setShowEditModalD] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isTaHistoryModalOpen, setIsTaHistoryModalOpen] = useState(false);

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
          showEditModalD || isHistoryModalOpen || isTaHistoryModalOpen
            ? "blur-background-detail no-interaction "
            : ""
        }  mx-auto h-screen w-full min-w-[1024px] select-none`}
      >
        {selectedCustomer && (
          <>
            <CustomerDetail
              customer={selectedCustomer}
              customerPk={customerPk}
              onUpdateSuccess={handleUpdateSuccess}
              showEditModal={showEditModalD}
              onEditClick={() => setShowEditModalD(true)}
              onCloseModal={() => setShowEditModalD(false)}
            />
            {/* <div class="flex h-full w-full justify-center bg-LightMode-SectionBackground "> */}
            <div class="mt-2 flex h-full w-full justify-center bg-white ">
              <div class="flex w-[1024px]">
                <CustomerTaHistory
                  customerPk={customerPk}
                  setIsTaHistoryModalOpen={setIsTaHistoryModalOpen}
                />
                <CustomerHistory
                  customerPk={customerPk}
                  setIsHistoryModalOpen={setIsHistoryModalOpen}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
