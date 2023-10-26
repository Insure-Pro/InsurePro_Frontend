import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setCustomers,
  setActiveType,
  setSelectedAge,
  setSelectedSort,
  setShowOptions,
  setSelectedContractYn,
  setShowEditModal,
  setSelectedCustomer,
  setFormattedDate,
} from "../redux/customerSlice";

const Navbar = ({
  onAllCustomersClick,
  onContractCompleteClick,
  onMonthCustomersClick,
  AllCustomersClick,
  ContractedCustomerClcik,
  setFormattedDate,
}) => {
  const [showItems, setShowItems] = useState(false);
  const [userName, setUserName] = useState("UserName"); // 초기값으로 'UserName' 설정
  const [selectedTab, setSelectedTab] = useState("전체");
  const activeType = useSelector((state) => state.customer.activeType);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageUrl = process.env.PUBLIC_URL + "/exit.png";

  const toggleItems = () => {
    setShowItems(!showItems);
  };
  const handleTabClick = (tabName) => {
    if (tabName === "월별 고객") {
      onMonthCustomersClick(); // 월별 고객을 클릭하면, onMonthCustomersClick을 호출합니다.
    } else if (tabName === "전체") {
      onAllCustomersClick(); // 전체를 클릭하면, onAllCustomersClick을 호출합니다.
    } else if (tabName === "계약완료고객") {
      onContractCompleteClick(); // 계약완료고객을 클릭하면, onContractCompleteClick을 호출합니다.
    }
  };

  const handleMonthClick = (year, month) => {
    const formatted = `${year}-${month}`;
    setFormattedDate(formatted);
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

  const handleAllCustomersClick = () => {
    if (onAllCustomersClick) {
      onAllCustomersClick();
    }
  };

  const handleLogoClick = () => {
    navigate("/main");
  };

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

      <div className="title">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="icon / jam-icons / outline &#38; logos / users">
            <path
              id="Vector"
              d="M5.534 12.57C5.65695 12.5175 5.78916 12.4903 5.92283 12.4898C6.0565 12.4893 6.18891 12.5156 6.31223 12.5672C6.43555 12.6188 6.54728 12.6945 6.64082 12.79C6.73436 12.8855 6.8078 12.9988 6.85681 13.1231C6.90582 13.2475 6.9294 13.3804 6.92615 13.514C6.92291 13.6477 6.8929 13.7793 6.83792 13.9011C6.78293 14.023 6.70408 14.1325 6.60602 14.2234C6.50796 14.3142 6.39268 14.3845 6.267 14.43C5.59854 14.6934 5.02483 15.1519 4.6205 15.7458C4.21618 16.3397 3.99997 17.0415 4 17.76V19.5C4 19.7652 4.10536 20.0196 4.29289 20.2071C4.48043 20.3946 4.73478 20.5 5 20.5H13C13.2652 20.5 13.5196 20.3946 13.7071 20.2071C13.8946 20.0196 14 19.7652 14 19.5V17.853C14.0001 17.1115 13.7749 16.3874 13.3541 15.7768C12.9334 15.1662 12.337 14.6979 11.644 14.434C11.5175 14.3901 11.4012 14.3213 11.3018 14.2316C11.2024 14.1419 11.1221 14.0332 11.0655 13.9119C11.009 13.7905 10.9773 13.6591 10.9725 13.5253C10.9677 13.3916 10.9897 13.2582 11.0374 13.1331C11.0851 13.008 11.1574 12.8938 11.25 12.7972C11.3427 12.7006 11.4538 12.6235 11.5767 12.5706C11.6997 12.5177 11.832 12.4901 11.9659 12.4893C12.0998 12.4885 12.2324 12.5146 12.356 12.566C13.4276 12.9742 14.3499 13.6983 15.0006 14.6425C15.6514 15.5867 15.9999 16.7063 16 17.853V19.5C16 20.2956 15.6839 21.0587 15.1213 21.6213C14.5587 22.1839 13.7956 22.5 13 22.5H5C4.20435 22.5 3.44129 22.1839 2.87868 21.6213C2.31607 21.0587 2 20.2956 2 19.5V17.76C2.00014 16.6402 2.33728 15.5463 2.96756 14.6206C3.59785 13.695 4.4921 12.9805 5.534 12.57ZM9 2.5C10.0609 2.5 11.0783 2.92143 11.8284 3.67157C12.5786 4.42172 13 5.43913 13 6.5V8.5C13 9.56087 12.5786 10.5783 11.8284 11.3284C11.0783 12.0786 10.0609 12.5 9 12.5C7.93913 12.5 6.92172 12.0786 6.17157 11.3284C5.42143 10.5783 5 9.56087 5 8.5V6.5C5 5.43913 5.42143 4.42172 6.17157 3.67157C6.92172 2.92143 7.93913 2.5 9 2.5ZM9 4.5C8.46957 4.5 7.96086 4.71071 7.58579 5.08579C7.21071 5.46086 7 5.96957 7 6.5V8.5C7 9.03043 7.21071 9.53914 7.58579 9.91421C7.96086 10.2893 8.46957 10.5 9 10.5C9.53043 10.5 10.0391 10.2893 10.4142 9.91421C10.7893 9.53914 11 9.03043 11 8.5V6.5C11 5.96957 10.7893 5.46086 10.4142 5.08579C10.0391 4.71071 9.53043 4.5 9 4.5ZM18 21.5C17.7348 21.5 17.4804 21.3946 17.2929 21.2071C17.1054 21.0196 17 20.7652 17 20.5C17 20.2348 17.1054 19.9804 17.2929 19.7929C17.4804 19.6054 17.7348 19.5 18 19.5H19C19.2652 19.5 19.5196 19.3946 19.7071 19.2071C19.8946 19.0196 20 18.7652 20 18.5V16.662C20 15.9512 19.7763 15.2583 19.3606 14.6817C18.9449 14.105 18.3584 13.6738 17.684 13.449C17.5594 13.4075 17.4441 13.3419 17.3449 13.2558C17.2456 13.1698 17.1643 13.0651 17.1055 12.9476C17.0467 12.8301 17.0117 12.7022 17.0023 12.5712C16.993 12.4402 17.0095 12.3086 17.051 12.184C17.0925 12.0594 17.1581 11.9441 17.2442 11.8449C17.3302 11.7456 17.4349 11.6643 17.5524 11.6055C17.6699 11.5467 17.7978 11.5117 17.9288 11.5023C18.0598 11.493 18.1914 11.5095 18.316 11.551C19.3888 11.9085 20.3219 12.5945 20.9831 13.5118C21.6443 14.4291 22.0001 15.5312 22 16.662V18.5C22 19.2956 21.6839 20.0587 21.1213 20.6213C20.5587 21.1839 19.7956 21.5 19 21.5H18ZM15 3.5C14.7348 3.5 14.4804 3.39464 14.2929 3.20711C14.1054 3.01957 14 2.76522 14 2.5C14 2.23478 14.1054 1.98043 14.2929 1.79289C14.4804 1.60536 14.7348 1.5 15 1.5C16.0609 1.5 17.0783 1.92143 17.8284 2.67157C18.5786 3.42172 19 4.43913 19 5.5V7.5C19 8.56087 18.5786 9.57828 17.8284 10.3284C17.0783 11.0786 16.0609 11.5 15 11.5C14.7348 11.5 14.4804 11.3946 14.2929 11.2071C14.1054 11.0196 14 10.7652 14 10.5C14 10.2348 14.1054 9.98043 14.2929 9.79289C14.4804 9.60536 14.7348 9.5 15 9.5C15.5304 9.5 16.0391 9.28929 16.4142 8.91421C16.7893 8.53914 17 8.03043 17 7.5V5.5C17 4.96957 16.7893 4.46086 16.4142 4.08579C16.0391 3.71071 15.5304 3.5 15 3.5Z"
              fill="white"
            />
          </g>
        </svg>
        Client
      </div>
      <>
        <div
          className="navbar-item"
          onClick={() => {
            setSelectedTab("전체");
            onAllCustomersClick();
            handleTabClick("전체");
            AllCustomersClick();
          }}
          style={{
            color: selectedTab === "전체" ? "#175cd3" : "black",
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
      </>
    </div>
  );
};

export default Navbar;
