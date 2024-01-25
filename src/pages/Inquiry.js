import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FormCheck } from "react-bootstrap";

const Inquiry = ({}) => {
  const location = useLocation();
  const { customerPk } = location.state;
  const [customerSchedules, setCustomerSchedules] = useState({});

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModalD, setShowEditModalD] = useState(false);

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
        class=" mx-auto h-screen w-full min-w-[1024px] bg-gray-100 pt-[76px]"
        style={{
          userSelect: "none",
        }}
      >
        <div class="h-[86px] bg-white px-12  py-4 text-start font-normal">
          {" "}
          <div class="mb-2">안녕하세요 INSUREPRO CS TEAM입니다.</div>
          <div>
            보다 나은 서비스를 제공하기 위해 여러분들의 불편사항 및 문의 사항을
            접수 받고 있습니다.
          </div>
        </div>

        <div class="flex h-[558px] flex-col items-start bg-gray-100 pl-[75px] pt-10 align-top  text-sm">
          <div class="mb-10 ">
            <span class="mr-[82px]">내용</span>
            <input
              class=" h-[186px] w-[782px]  p-4 pb-2   align-text-top"
              type="text"
              as="textarea"
              rows={10}
            ></input>
          </div>
          <div class="flex items-center">
            <span class="mr-[58px]">파일첨부</span>

            <label htmlFor="file">
              <div class="btn-upload ">파일 업로드하기</div>
            </label>
            <input type="file" name="file" id="file"></input>
          </div>
          <div class="mb-1 mt-[88px] flex">
            <FormCheck />
            <span class="ml-2 text-xs font-light">
              개인정보 수집 및 이용 동의(필수)
            </span>
          </div>
          <div class=" mb-5 flex h-9 w-[890px] items-center  bg-[#E4E7EC]  pl-4  text-xs font-light text-[#98A2B3]">
            문의 처리를 위해 이메일, 회원정보, 문의내용에 포함된 개인정보를
            수집하며, 개인정보처리방침에 따라 3년 후 파기됩니다.
          </div>
          <div class="flex w-full justify-center">
            <div class="flex h-[40px] w-[280px] items-center justify-center  border border-primary-100 py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white">
              접수
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
