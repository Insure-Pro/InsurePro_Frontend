import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/authSlice";
import NavbarItem from "./NavbarItem";
import Search from "./Search";
import DateChangeAModal from "./Modal/DateChangeAModal";
import { toggleSearch } from "../redux/searchSlice";
import { setSearchOff } from "../redux/searchSlice";

const Navbar = ({
  onAllCustomersClick,
  onContractCompleteClick,
  onMonthCustomersClick,
  setCustomers,
  isLandingPage = false,
  currentSection,
  resetFiltersAndSort,
  resetSearch,
}) => {
  const [userName, setUserName] = useState("UserName");
  const [selectedTab, setSelectedTab] = useState("전체");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownClicked, setDropdownClicked] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setDropdownClicked(!dropdownClicked);
  };

  const location = useLocation();

  // 현재 경로가 /main인지 체크
  const isMainRoute = location.pathname === "/main";

  // Retrieve the login status from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // Modify this function to handle logo click based on login status
  const handleLogoClick = () => {
    if (isLoggedIn) {
      // 로그인 상태일 경우
      if (typeof resetFiltersAndSort === "function") {
        navigate("/main", { state: { selectedTab: "로고" } });
        resetSearch();
      }
    } else {
      // User is not logged in, navigate to /landingPage
      navigate("/landingPage");
    }
    // resetSearch(); // 검색 결과 초기화
  };

  const right_icon = process.env.PUBLIC_URL + "/arrow-right.png";
  const search = process.env.PUBLIC_URL + "/search.png";
  const mypage = process.env.PUBLIC_URL + "/mypage.png";

  const handleTabClick = (tabName) => {
    // Update the analysis selected state based on whether the 'Analysis' tab is clicked
    setSelectedTab(tabName); // 탭 상태를 직접 업데이트

    // Update selected tab state

    // Call the appropriate handler based on the tab name
    if (tabName === "월별 고객") {
      onMonthCustomersClick();
      navigate("/main", { state: { selectedTab: "월별 고객" } });
    } else if (tabName === "전체") {
      navigate("/main", { state: { selectedTab: "전체" } });
      // onAllCustomersClick();
    } else if (tabName === "계약완료고객") {
      onContractCompleteClick();
      navigate("/main", { state: { selectedTab: "계약완료고객" } });
    } else if (tabName === "로고") {
      // resetFiltersAndSort();
      navigate("/main", { state: { selectedTab: "로고" } });
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

  // Simplified the function to get the font weight based on the selected tab
  const getFontWeight = (tabName) =>
    selectedTab === tabName ? "Bold" : "normal";

  //기존 Navigate로 페이지 이동 함수 하나로 합침
  const handleTabChange = (selectedTab) => {
    setSelectedTab(selectedTab);
    navigate(`/${selectedTab.toLowerCase()}`, { state: { selectedTab } });
  };

  useEffect(() => {
    const tab = location.state?.selectedTab;
    if (tab) {
      setSelectedTab(tab);
    }
  }, [location]);

  const showSearch = useSelector((state) => state.search.showSearch);
  // Update event handlers
  const handleSearchToggle = () => {
    dispatch(toggleSearch());
    setShowDropdown(false);
  };

  const [showDate, setShowDate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );

  const formattedDateTitle = `${selectedYear}년 ${String(
    selectedMonth,
  ).padStart(2, "0")}월`; // formattedDate 업데이트

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

  // '고객관리' 클릭 핸들러
  const handleClientClick = () => {
    dispatch(setSearchOff()); // showSearch를 false로 설정
    if (isLoggedIn) {
      resetSearch();
      toggleDropdown();
    }
  };

  // Handle the close action for the Search component
  const handleCloseSearch = () => {
    dispatch(setSearchOff()); // Dispatch setSearchOff action to hide the Search component
  };

  //로그인 상태에서 마이페이지 아이콘 클릭시 로그아웃 버튼
  const [showLogoutButton, setShowLogoutButton] = useState(false); // 로그아웃 버튼 표시 상태

  const logoutButtonRef = useRef(null); // 로그아웃 버튼 참조

  // 마이페이지 아이콘 클릭 핸들러 수정
  const handleMypageClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowLogoutButton(!showLogoutButton); // 로그아웃 버튼 토글
    }
  };

  // 외부 클릭 감지를 위한 이벤트 핸들러
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        logoutButtonRef.current &&
        !logoutButtonRef.current.contains(event.target)
      ) {
        setShowLogoutButton(false); // 외부 클릭 시 로그아웃 버튼 숨김
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [logoutButtonRef]);

  return (
    <>
      <div
        className={`vertical-navbar flex w-full min-w-[1024px] flex-col ${
          isLandingPage ? "landing-page-navbar" : ""
        }`}
      >
        <div
          className="brand w-2/12"
          onClick={() => {
            handleTabClick("로고");
            handleLogoClick();
          }}
        >
          INSUREPRO
        </div>

        <div
          className={`navbar-container w-10/12 max-w-[1000px] justify-between pt-1`}
        >
          <div className="navbar-wrapper w-1/2">
            <div
              className="client  cursor-pointer font-light"
              onClick={() => {
                handleClientClick();
                handleTabChange("Main");
              }}
              style={{ fontWeight: getFontWeight("Main") }}
            >
              고객관리
            </div>

            {showDropdown && (
              <NavbarItem
                selectedTab={selectedTab}
                onAllCustomersClick={onAllCustomersClick}
                onMonthCustomersClick={onMonthCustomersClick}
                onContractCompleteClick={onContractCompleteClick}
                handleTabClick={handleTabClick}
                toggleDropdown={toggleDropdown}
                handleTabChange={handleTabChange}
                handleshowDateClick={handleshowDateClick}
                handleCloseDateClick={handleCloseDateClick}
              />
            )}
            {showDropdown && <div className="navbar-black-blur"></div>}
          </div>
          <div
            className=" w-1/2 cursor-pointer"
            onClick={() => handleTabChange("Analysis")}
            style={{ fontWeight: getFontWeight("Analysis") }}
          >
            성과분석
          </div>

          <div
            className=" w-1/2  cursor-pointer  font-light"
            onClick={() => handleTabChange("Inquiry")}
            style={{ fontWeight: getFontWeight("Inquiry") }}
          >
            문의하기
          </div>
          <div
            className=" w-1/2 cursor-pointer  font-light"
            onClick={() => handleTabChange("LandingPage")}
            style={{ fontWeight: getFontWeight("LandingPage") }}
          >
            회사소개
          </div>
        </div>

        <div class="flex w-2/12  max-w-[390px] justify-end ">
          <div class="flex max-w-[90px]   justify-between">
            {/* 검색 아이콘은 /main 경로일 때만 표시 */}
            {isMainRoute && isLoggedIn && (
              <div className=" h-6 cursor-pointer pr-7">
                {/* 여기서 h-7이상 입력하면 Navbar 세로 길이 차이발생 */}
                <img src={search} onClick={handleSearchToggle} />
              </div>
            )}
            <div className="cursor-pointer pt-1" ref={logoutButtonRef}>
              {/* <img src={mypage} onClick={handleLogout} /> */}
              <img src={mypage} onClick={handleMypageClick} />
              {showLogoutButton && (
                <div
                  className="absolute right-3 top-14 flex h-[38px] w-[90px] items-center justify-center rounded border bg-white text-center text-sm font-semibold text-LightMode-Text hover:bg-LightMode-Hover"
                  onClick={handleLogout}
                >
                  로그아웃
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 조건부로 /main 경로에서만 Search컴포넌트 랜더링 되도록*/}
      {isMainRoute && showSearch && (
        <div class=" flex h-[88px]  w-full items-center justify-center bg-white ">
          <Search setCustomers={setCustomers} onClose={handleCloseSearch} />
        </div>
      )}
      {isMainRoute && showSearch && (
        <div className="navbar-search-black-blur"></div>
      )}
      {showDate && (
        <div class="mb-[-76px]  ml-12 w-full pt-[76px]">
          <div class="flex h-10  items-center justify-start bg-white text-[17px]  font-bold  text-LightMode-Text">
            <div onClick={handleFormattedDateClick} class="cursor-pointer">
              {formattedDateTitle}
            </div>
            <img
              onClick={handleFormattedDateClick}
              class="cursor-pointer pl-1"
              src={right_icon}
            />
            {/* The rest of the content, blurred when modal is open */}

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
      {isModalOpen && <div className="blur-navbar-datechange"></div>}
    </>
  );
};

export default Navbar;
