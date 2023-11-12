import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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

  const location = useLocation();

  const users_black = process.env.PUBLIC_URL + "/users_black.png";
  const users_white = process.env.PUBLIC_URL + "/users_white.png";
  const graph_black = process.env.PUBLIC_URL + "/bar_graph_black.png";
  const graph_white = process.env.PUBLIC_URL + "/bar_graph_white.png";

  const handleTabClick = (tabName) => {
    // Update the analysis selected state based on whether the 'Analysis' tab is clicked
    setIsAnalysisSelected(tabName === "Analysis");

    // Update selected tab state
    setSelectedTab(tabName);

    // Call the appropriate handler based on the tab name
    if (tabName === "월별 고객") {
      onMonthCustomersClick();
    } else if (tabName === "전체") {
      onAllCustomersClick();
    } else if (tabName === "계약완료고객") {
      onContractCompleteClick();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://www.insurepro.kro.kr/v1/logout",
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Logout successful");
        localStorage.removeItem("accessToken"); // 토큰 삭제
        navigate("/login"); // 로그인 페이지로 리다이렉션
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
    navigate("/analysis", { state: { selectedTab: "Analysis" } });
  };
  useEffect(() => {
    // Assuming 'selectedTab' is passed in state when navigating to this page
    const tab = location.state?.selectedTab;
    if (tab === "Analysis") {
      setIsAnalysisSelected(true);
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
          backgroundColor: !isAnalysisSelected ? "#175cd3" : "transparent",
          color: !isAnalysisSelected ? "#fff" : "#000",
        }}
        onClick={() => {
          setSelectedTab("전체");
          onAllCustomersClick();
          handleTabClick("전체");
          AllCustomersClick();
        }}
      >
        <img
          src={isAnalysisSelected ? users_black : users_white}
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
              selectedTab === "전체" && !isAnalysisSelected
                ? "#175cd3"
                : "black",
            fontWeight: selectedTab === "전체" ? "bold" : "500",
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
            backgroundColor: isAnalysisSelected ? "#175cd3" : "transparent",
            color: isAnalysisSelected ? "#fff" : "#000",
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
      </div>
    </div>
  );
};

export default Navbar;
