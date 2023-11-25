import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/authSlice";

const Navbar = ({
  onAllCustomersClick,
  onContractCompleteClick,
  onMonthCustomersClick,
  AllCustomersClick,
  ContractedCustomerClcik,
  setFormattedDate,
}) => {
  // const [showItems, setShowItems] = useState(false);
  const [userName, setUserName] = useState("UserName"); // 초기값으로 'UserName' 설정
  const [selectedTab, setSelectedTab] = useState("전체");
  const activeType = useSelector((state) => state.customer.activeType);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageUrl = process.env.PUBLIC_URL + "/exit.png";

  const [isAnalysisSelected, setIsAnalysisSelected] = useState(false);
  const [isMapSelected, setIsMapSelected] = useState(false);

  const location = useLocation();

  const users_black = process.env.PUBLIC_URL + "/users_black.png";
  const users_white = process.env.PUBLIC_URL + "/users_white.png";
  const graph_black = process.env.PUBLIC_URL + "/bar_graph_black.png";
  const graph_white = process.env.PUBLIC_URL + "/bar_graph_white.png";
  const map_black = process.env.PUBLIC_URL + "/map_black2.png";
  const map_white = process.env.PUBLIC_URL + "/map_white2.png";

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
        InsurePro
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="userName"
          style={{
            fontSize: "20px",
            color: "#175CD3",
            fontWeight: "700",
            justifyItems: "center",
            cursor: "default",
          }}
        >
          {userName}
        </div>
        <div
          className="userName"
          style={{ fontSize: "16px", marginLeft: "2px", cursor: "default" }}
        >
          님 환영합니다.
        </div>
        <img
          className="userName"
          src={imageUrl}
          style={{ paddingLeft: "16px", cursor: "pointer" }}
          onClick={handleLogout}
        />
      </div>

      <div
        className="title"
        style={{
          backgroundColor:
            !isMapSelected && !isAnalysisSelected ? "#175cd3" : "transparent",
          color: !isMapSelected && !isAnalysisSelected ? "#fff" : "#000",
        }}
        onClick={() => {
          setSelectedTab("전체");
          onAllCustomersClick();
          handleTabClick("전체");
          AllCustomersClick();
        }}
      >
        <img
          src={isAnalysisSelected || isMapSelected ? users_black : users_white}
          style={{
            paddingRight: "8px",
          }}
        />
        Client
      </div>
      <div className="navbar-items">
        <div
          className="navbar-item"
          onClick={() => {
            setSelectedTab("전체");
            onAllCustomersClick();
            handleTabClick("전체");
            AllCustomersClick();
          }}
          style={{
            color:
              selectedTab === "전체" && !isAnalysisSelected && !isMapSelected
                ? "#175cd3"
                : "black",
            fontWeight:
              selectedTab === "전체" && !isAnalysisSelected && !isMapSelected
                ? "bold"
                : "500",
          }}

          // onClick={handleAllCustomersClick}>
        >
          전체
        </div>
        <div
          className="navbar-item"
          onClick={() => {
            setSelectedTab("계약완료고객");
            onContractCompleteClick();
            handleTabClick("계약완료고객");
            ContractedCustomerClcik();
          }}
          style={{
            color: selectedTab === "계약완료고객" ? "#175cd3" : "black",
            fontWeight: selectedTab === "계약완료고객" ? "bold" : "500",
          }}
        >
          계약완료고객
        </div>
        <div
          className="navbar-item"
          onClick={() => {
            setSelectedTab("월별 고객");
            handleTabClick("월별 고객");
            onMonthCustomersClick();
          }}
          style={{
            color: selectedTab === "월별 고객" ? "#175cd3" : "black",
            fontWeight: selectedTab === "월별 고객" ? "bold" : "500",
          }}
        >
          월별 고객
        </div>
        <div
          className="title analysis"
          onClick={handleAnalysisClick}
          style={{
            backgroundColor:
              isAnalysisSelected && !isMapSelected ? "#175cd3" : "transparent",
            color: isAnalysisSelected && !isMapSelected ? "#fff" : "#000",
            fontWeight: "600",
          }}
        >
          <img
            src={!isAnalysisSelected ? graph_black : graph_white}
            style={{
              paddingRight: "8px",
            }}
          />
          Analysis
        </div>
        <div
          className="title analysis"
          onClick={handleMapClick}
          style={{
            backgroundColor: isMapSelected ? "#175cd3" : "transparent",
            color: isMapSelected ? "#fff" : "#000",
          }}
        >
          <img
            src={!isMapSelected ? map_black : map_white}
            style={{
              paddingRight: "8px",
            }}
          />
          Map
        </div>
      </div>
    </div>
  );
};

export default Navbar;
