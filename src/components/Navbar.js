import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/authSlice";
import NavbarItem from "./NavbarItem";
import Search from "./Search";

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
          }
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

  return (
    <div className="vertical-navbar">
      <div className="brand" onClick={() => handleLogoClick()}>
        INSUREPRO
      </div>

      <div className="navbar-container">
        <div className="navbar-wrapper">
          <div
            className="client"
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
            />
          )}
        </div>
        <div
          className=""
          onClick={handleAnalysisClick}
          style={{
            backgroundColor:
              isAnalysisSelected && !isMapSelected ? "#175cd3" : "transparent",

            fontWeight: "normal",
          }}
        >
          성과분석
        </div>

        <div className="" onClick={handleMapClick}>
          문의하기
        </div>
        <div
          className=""
          onClick={handleMapClick}
          style={{
            backgroundColor: isMapSelected ? "#175cd3" : "transparent",
          }}
        >
          회사소개
        </div>
        <div
          className=""
          style={{
            backgroundColor: isMapSelected ? "#175cd3" : "transparent",
          }}
        >
          <img src={search} />
        </div>
        {showDropdown && <Search setCustomers={setCustomers} />}
        <div
          className=""
          style={{
            backgroundColor: isMapSelected ? "#175cd3" : "transparent",
          }}
        >
          <img src={mypage} onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
