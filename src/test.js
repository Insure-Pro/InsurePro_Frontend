import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { logoutSuccess, refreshAccessToken } from "../../../redux/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${MAIN_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          html:
            "<div style='text-align: left; font-size:16px;'>" +
            "로그아웃 되었습니다..<br><br>" +
            "</div>",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.clear();
      dispatch(logoutSuccess());
      navigate("/login");
    }
  };

  // 엑세스 토큰 만료 테스트 함수
  const testAccessTokenExpiry = async () => {
    // 엑세스 토큰을 만료된 값으로 설정
    localStorage.setItem("accessToken", "expiredAccessToken");

    // 보호된 리소스에 접근 시도
    try {
      const response = await axios.get(
        `${MAIN_URL}/customers/latest?customerTypePk=0`,
        {
          headers: {
            Authorization: `Bearer expiredAccessToken`,
          },
        },
      );
      console.log("Access to protected resource successful", response);
    } catch (error) {
      console.error("Access to protected resource failed", error);
      dispatch(refreshAccessToken());
    }
  };

  // 리프레시 토큰 만료 테스트 함수
  const testRefreshTokenExpiry = async () => {
    // 리프레시 토큰을 만료된 값으로 설정
    localStorage.setItem("refreshToken", "expiredRefreshToken");

    // 보호된 리소스에 접근 시도
    try {
      const response = await axios.get(
        `${MAIN_URL}/customers/latest?customerTypePk=0`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      console.log("Access to protected resource successful", response);
    } catch (error) {
      console.error("Access to protected resource failed", error);
      dispatch(refreshAccessToken());
    }
  };

  // 강제 엑세스 토큰 만료 테스트 함수
  const testForcedAccessTokenExpiry = async () => {
    // 엑세스 토큰을 유효시간이 1분인 토큰으로 설정
    localStorage.setItem("accessToken", "shortLivedAccessToken");

    // 1분 후 엑세스 토큰을 만료된 값으로 변경
    setTimeout(() => {
      localStorage.setItem("accessToken", "expiredAccessToken");

      // 보호된 리소스에 접근 시도
      axios
        .get(`${MAIN_URL}/customers/latest?customerTypePk=0`, {
          headers: {
            Authorization: `Bearer expiredAccessToken`,
          },
        })
        .catch((error) => {
          console.error("Access to protected resource failed", error);
          dispatch(refreshAccessToken());
        });
    }, 60000);

    // 보호된 리소스에 접근 시도
    try {
      const response = await axios.get(
        `${MAIN_URL}/customers/latest?customerTypePk=0`,
        {
          headers: {
            Authorization: `Bearer shortLivedAccessToken`,
          },
        },
      );
      console.log("Access to protected resource successful", response);
    } catch (error) {
      console.error("Access to protected resource failed", error);
      dispatch(refreshAccessToken());
    }
  };

  return (
    <nav className="flex flex-col">
      <button
        className="h-10 border border-Secondary-100"
        onClick={handleLogout}
      >
        Logout
      </button>
      {/* 테스트 버튼을 추가합니다 */}
      <button
        className="h-10 border border-Secondary-100"
        onClick={testAccessTokenExpiry}
      >
        Test Access Token Expiry
      </button>
      <button
        className="h-10 border border-Secondary-100"
        onClick={testRefreshTokenExpiry}
      >
        Test Refresh Token Expiry
      </button>
      <button
        className="h-10 border border-Secondary-100"
        onClick={testForcedAccessTokenExpiry}
      >
        Test Forced Access Token Expiry
      </button>
    </nav>
  );
};

export default Navbar;
