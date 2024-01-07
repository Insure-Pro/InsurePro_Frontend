import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/authSlice";
import NavbarItem from "./NavbarItem";
import Search from "./Search";
import DateChangeAModal from "./Modal/DateChangeAModal";

const Navbar = ({
  onAllCustomersClick,
  onContractCompleteClick,
  onMonthCustomersClick,
  AllCustomersClick,
  ContractedCustomerClcik,
  setCustomers,
}) => {
  const [userName, setUserName] = useState("UserName");
  const [selectedTab, setSelectedTab] = useState("전체");
  const activeType = useSelector((state) => state.customer.activeType);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageUrl = process.env.PUBLIC_URL + "/exit.png";

  const [isAnalysisSelected, setIsAnalysisSelected] = useState(false);
  const [isMapSelected, setIsMapSelected] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownClicked, setDropdownClicked] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setDropdownClicked(!dropdownClicked);
  };

  const location = useLocation();

  const users_black = process.env.PUBLIC_URL + "/users_black.png";
  const users_white = process.env.PUBLIC_URL + "/users_white.png";
  const graph_black = process.env.PUBLIC_URL + "/bar_graph_black.png";
  const graph_white = process.env.PUBLIC_URL + "/bar_graph_white.png";
  const map_black = process.env.PUBLIC_URL + "/map_black2.png";
  const map_white = process.env.PUBLIC_URL + "/map_white2.png";
  const right_icon = process.env.PUBLIC_URL + "/arrow-right.png";
  const search = process.env.PUBLIC_URL + "/search.png";
  const mypage = process.env.PUBLIC_URL + "/mypage.png";

  const handleTabClick = (tabName) => {
    // Update the analysis selected state based on whether the 'Analysis' tab is clicked
    setIsAnalysisSelected(tabName === "Analysis");
    setIsMapSelected(tabName === "Map");

    // Update selected tab state
    setSelectedTab(tabName);

    // Call the appropriate handler based on the tab name
    if (tabName === "월별 고객") {
      onMonthCustomersClick();
      navigate("/main", { state: { selectedTab: "월별 고객" } });
    } else if (tabName === "전체") {
      onAllCustomersClick();
      navigate("/main", { state: { selectedTab: "전체" } });
    } else if (tabName === "계약완료고객") {
      onContractCompleteClick();
      navigate("/main", { state: { selectedTab: "계약완료고객" } });
    }
  };
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${MAIN_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 200) {
        localStorage.removeItem("accessToken"); // Remove access token
        localStorage.removeItem("refreshToken"); // Remove refresh token
        dispatch(logoutSuccess()); // Dispatch logoutSuccess action
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed", error);
      if (error.response && error.response.data) {
        console.error("Error message:", error.response.data.message);
      }
    }
  };

  useEffect(() => {
    // 서버에서 직원 정보를 가져오는 함수
    const fetchEmployeeName = async () => {
      try {
        const response = await fetch(
          "https://www.insurepro.kro.kr/v1/employee",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        setUserName(data.name); // 응답으로 받은 직원 이름을 상태 변수에 저장
      } catch (error) {
        console.error("Failed to fetch employee name:", error);
      }
    };

    fetchEmployeeName(); // 직원 정보를 가져오는 함수 호출
  }, []); // componentDidMount와 동일한 효과를 위해 빈 dependency 배열 사용

  const handleLogoClick = () => {
    navigate("/main", { state: { selectedTab: "전체" } });
  };

  const handleAnalysisClick = () => {
    setIsAnalysisSelected(true);
    setIsMapSelected(false); // Ensure 'Map' is not selected
    setSelectedTab("Analysis"); // 'Analysis' 탭을 선택했음을 상태에 설정
    navigate("/analysis", { state: { selectedTab: "Analysis" } });
  };

  const handleMapClick = () => {
    setIsMapSelected(true);
    setIsAnalysisSelected(false);
    setSelectedTab("Map"); // 'Analysis' 탭을 선택했음을 상태에 설정
    navigate("/map", { state: { selectedTab: "Map" } });
  };

  const handleInquiryClick = () => {
    setIsMapSelected(false);
    setIsAnalysisSelected(false);
    setSelectedTab("Inquiry"); // 'Analysis' 탭을 선택했음을 상태에 설정
    navigate("/inquiry", { state: { selectedTab: "Inquiry" } });
  };

  useEffect(() => {
    const tab = location.state?.selectedTab;
    if (tab === "Analysis") {
      setIsAnalysisSelected(true);
      setIsMapSelected(false); // Ensure that map is not selected when analysis is selected
    } else if (tab === "Map") {
      setIsMapSelected(true);
      setIsAnalysisSelected(false); // Ensure that analysis is not selected when map is selected
    }
  }, [location]);

  const [showSearch, setShowSearch] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const handleSearchOpen = () => {
  //   setIsSearchOpen(true);
  // };

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );

  const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(
    2,
    "0",
  )}`; // formattedDate 업데이트

  const formattedDateTitle = `${selectedYear}년 ${String(
    selectedMonth,
  ).padStart(2, "0")}월`; // formattedDate 업데이트
  const handleMonthCustomersClick = () => {
    setSelectedTab("월별 고객"); // 계약 완료 여부를 true로 설정
  };
  const handleAllCustomersClick = () => {
    setSelectedTab("전체");
  };

  const handleContractCompleteClick = () => {
    setSelectedTab("계약완료고객");
  };

  const handleFormattedDateClick = () => {
    if (selectedTab === "월별 고객") {
      setIsModalOpen(true);
    }
  };
  const handleshowDateClick = () => {
    setShowDate(true);
  };
  const handleCloseDateClick = () => {
    setShowDate(false);
  };

  // 선택한 년, 월로 formattedDate를 업데이트하는 함수
  const handleDateChange = (newYear, newMonth, fetchedData) => {
    setSelectedYear(newYear);
    setSelectedMonth(newMonth);
    setIsModalOpen(false); // Optionally, close the modal after changing the date
    const formattedDate2 = `${newYear}-${String(newMonth).padStart(2, "0")}`;
    onMonthCustomersClick(formattedDate2);
  };

  return (
    <>
      <div className="vertical-navbar flex w-full min-w-[1024px] flex-col">
        <div className="brand w-2/12" onClick={() => handleLogoClick()}>
          INSUREPRO
        </div>

        <div className="navbar-container w-10/12 max-w-[1000px] justify-between pt-1 text-LightMode-Text">
          <div className="navbar-wrapper w-1/2">
            <div
              className="client  cursor-pointer font-light"
              style={{
                fontWeight:
                  !isMapSelected && !isAnalysisSelected ? "Bold" : "normal",
              }}
              onClick={() => {
                setSelectedTab("전체");
                onAllCustomersClick();
                handleTabClick("전체");
                AllCustomersClick();
                toggleDropdown();
              }}
            >
              고객관리
            </div>
            {showDropdown && (
              <NavbarItem
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                onAllCustomersClick={onAllCustomersClick}
                onMonthCustomersClick={onMonthCustomersClick}
                handleTabClick={handleTabClick}
                AllCustomersClick={AllCustomersClick}
                ContractedCustomerClcik={ContractedCustomerClcik}
                onContractCompleteClick={onContractCompleteClick}
                handleMapClick={handleMapClick}
                toggleDropdown={toggleDropdown}
                handleshowDateClick={handleshowDateClick}
                handleCloseDateClick={handleCloseDateClick}
              />
            )}
          </div>
          <div
            className=" w-1/2 cursor-pointer"
            onClick={handleAnalysisClick}
            style={{
              fontWeight: isAnalysisSelected && !isMapSelected ? "700" : "300",
            }}
          >
            성과분석
          </div>

          <div
            className=" w-1/2  cursor-pointer  font-light"
            onClick={handleInquiryClick}
          >
            문의하기
          </div>
          <div
            className=" w-1/2 cursor-pointer  font-light"
            onClick={handleMapClick}
          >
            회사소개
          </div>
        </div>
        <div class="flex w-2/12  max-w-[390px] justify-end ">
          <div class="flex max-w-[90px]   justify-between">
            <div className="cursor-pointer pr-7">
              <img
                src={search}
                onClick={() => setShowSearch((prev) => !prev)}
              />
            </div>
            <div className="cursor-pointer pt-1">
              <img src={mypage} onClick={handleLogout} />
            </div>
          </div>
        </div>
      </div>
      {showSearch && (
        <div class=" flex h-[88px] w-full items-center justify-center bg-white">
          <Search setCustomers={setCustomers} />
        </div>
      )}
      {showDate && (
        <div class="ml-12 w-full">
          <div class="flex h-10  items-center justify-start bg-white text-[17px]  font-bold  text-LightMode-Text">
            <div onClick={handleFormattedDateClick}>{formattedDateTitle}</div>
            <img class="pl-1" src={right_icon} />
            {isModalOpen && (
              <DateChangeAModal
                initialYear={selectedYear}
                initialMonth={selectedMonth}
                onDateChange={handleDateChange}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
