//엑세스 토큰 & 리프레쉬 토큰 테스트 코드
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { logoutSuccess } from "../../../redux/authSlice";
// import { MAIN_URL } from "../constants";

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
  const testAccessTokenExpiry = () => {
    // 엑세스 토큰을 만료된 값으로 설정
    let accessToken = localStorage.getItem("accessToken");
    accessToken = "expiredAccessToken";
    localStorage.setItem("accessToken", accessToken);

    // 보호된 리소스에 접근 시도
    axios
      .get(`${MAIN_URL}/protected-resource`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log("Access to protected resource successful", response);
      })
      .catch((error) => {
        console.error("Access to protected resource failed", error);
      });
  };

  // 리프레시 토큰 만료 테스트 함수
  const testRefreshTokenExpiry = () => {
    // 리프레시 토큰을 만료된 값으로 설정
    let refreshToken = localStorage.getItem("refreshToken");
    refreshToken = "expiredRefreshToken";
    localStorage.setItem("refreshToken", refreshToken);

    // 보호된 리소스에 접근 시도
    axios
      .get(`${MAIN_URL}/protected-resource`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        console.log("Access to protected resource successful", response);
      })
      .catch((error) => {
        console.error("Access to protected resource failed", error);
      });
  };

  return (
    <nav>
      <button onClick={handleLogout}>Logout</button>
      {/* 테스트 버튼을 추가합니다 */}
      <button onClick={testAccessTokenExpiry}>Test Access Token Expiry</button>
      <button onClick={testRefreshTokenExpiry}>Test Refresh Token Expiry</button>
    </nav>
  );
};

export default Navbar;
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { logoutSuccess, refreshToken } from "../../../redux/authSlice";

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
    let accessToken = localStorage.getItem("accessToken");
    accessToken = "expiredAccessToken";
    localStorage.setItem("accessToken", accessToken);

    // 보호된 리소스에 접근 시도
    try {
      const response = await axios.get(
        `${MAIN_URL}/customers/latest?customerTypePk=0`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("Access to protected resource successful", response);
    } catch (error) {
      console.error("Access to protected resource failed", error);
      dispatch(refreshToken());
    }
  };

  // 리프레시 토큰 만료 테스트 함수
  const testRefreshTokenExpiry = async () => {
    // 리프레시 토큰을 만료된 값으로 설정
    let refreshToken = localStorage.getItem("refreshToken");
    refreshToken = "expiredRefreshToken";
    localStorage.setItem("refreshToken", refreshToken);

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
      dispatch(refreshToken());
    }
  };

  // 강제 엑세스 토큰 만료 테스트 함수
  const testForcedAccessTokenExpiry = async () => {
    // 엑세스 토큰을 유효시간이 1분인 토큰으로 설정
    let accessToken = "shortLivedAccessToken";
    localStorage.setItem("accessToken", accessToken);

    // 1분 후 엑세스 토큰을 만료된 값으로 변경
    setTimeout(() => {
      accessToken = "expiredAccessToken";
      localStorage.setItem("accessToken", accessToken);
    }, 60000);

    // 보호된 리소스에 접근 시도
    try {
      const response = await axios.get(
        `${MAIN_URL}/customers/latest?customerTypePk=0`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("Access to protected resource successful", response);
    } catch (error) {
      console.error("Access to protected resource failed", error);
      dispatch(refreshToken());
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
