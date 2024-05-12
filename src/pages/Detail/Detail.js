import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../../App.css";
import "../Detail/Detail.css";
import Navbar from "../../components/Main/Navbar/Navbar";
import CustomerDetail from "../../components/Detail/CustomerDetail";
import MobileCustomerDetail from "../../components/Detail/MobileCustomerDetail";
import CustomerHistory from "../../components/Detail/CustomerHistory";
import MobileCustomerHistory from "../../components/Detail/MobileCustomerHistory";
import CustomerTaHistory from "../../components/Detail/CustomerTaHistory";
import MobileCustomerTaHistory from "../../components/Detail/MobileCustomerTaHistory";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const Detail = ({}) => {
  const location = useLocation();
  const { customerPk } = location.state;
  // const [customerSchedules, setCustomerSchedules] = useState({});

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showEditModalD, setShowEditModalD] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isTaHistoryModalOpen, setIsTaHistoryModalOpen] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width:500px)" });

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const [activeTab, setActiveTab] = useState("전화상담"); // Default to '고객 정보'

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
        }  mx-auto h-screen w-full ${
          isMobile ? "" : "min-w-[1024px]"
        } select-none`}
      >
        {selectedCustomer && (
          <>
            {isMobile ? (
              <MobileCustomerDetail
                customer={selectedCustomer}
                customerPk={customerPk}
                onUpdateSuccess={handleUpdateSuccess}
                showEditModal={showEditModalD}
                onEditClick={() => setShowEditModalD(true)}
                onCloseModal={() => setShowEditModalD(false)}
              />
            ) : (
              <CustomerDetail
                customer={selectedCustomer}
                customerPk={customerPk}
                onUpdateSuccess={handleUpdateSuccess}
                showEditModal={showEditModalD}
                onEditClick={() => setShowEditModalD(true)}
                onCloseModal={() => setShowEditModalD(false)}
              />
            )}

            {/* <div class="flex h-full w-full justify-center bg-LightMode-SectionBackground "> */}
            <div class="mt-2 flex  w-full justify-center bg-white ">
              {isMobile ? (
                <div>
                  <div class="mt-[16px] flex h-9 w-[360px] items-center justify-center rounded border bg-white text-LightMode-Subtext">
                    <button
                      class={`h-8 w-[170px] rounded-xl border ${
                        activeTab === "전화상담"
                          ? " bg-Secondary-50/60 font-semibold"
                          : " font-normal"
                      }`}
                      onClick={() => setActiveTab("전화상담")}
                    >
                      전화상담
                    </button>
                    <button
                      class={`h-8 w-[170px] rounded-xl border ${
                        activeTab === "진척도"
                          ? " bg-Secondary-50/60 font-semibold"
                          : " font-normal"
                      }`}
                      onClick={() => setActiveTab("진척도")}
                    >
                      진척도
                    </button>
                  </div>

                  {activeTab === "전화상담" ? (
                    <MobileCustomerTaHistory
                      customerPk={customerPk}
                      setIsTaHistoryModalOpen={setIsTaHistoryModalOpen}
                    />
                  ) : (
                    <MobileCustomerHistory
                      customerPk={customerPk}
                      setIsHistoryModalOpen={setIsHistoryModalOpen}
                    />
                  )}
                </div>
              ) : (
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
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
