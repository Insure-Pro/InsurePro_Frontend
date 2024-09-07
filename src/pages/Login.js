/* global gtag */
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import Navbar from "../components/Main/Navbar/Navbar";
import { useMediaQuery } from "react-responsive";
import NewLogin from "./NewLogin";
import Swal from "sweetalert2";

const Login = () => {
  const email = useRef("");
  const password = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [myEmail, setMyEmail] = useState("");
  const [myPassword, setMyPassword] = useState("");
  const [showMobileLogin, setShowMobileLogin] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width:500px)" });

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const kakao_signin_medium_wide =
    process.env.PUBLIC_URL + "/kakao_login_medium_wide.png";
  const kakao_login_medium_wide =
    process.env.PUBLIC_URL + "/kakao_login_medium_wide2.png";
  const kakao_signin_large_wide =
    process.env.PUBLIC_URL + "/kakao_login_large_wide.png";
  const kakao_login_large_wide =
    process.env.PUBLIC_URL + "/kakao_login_large_wide2.png";

  const onLogin = async () => {
    try {
      const response = await axios.post(`${MAIN_URL}/login`, {
        email: email.current.value,
        password: password.current.value,
      });

      if (response.status === 200) {
        const { authorization, refresh } = response.headers;
        const accessToken = authorization.split(" ")[1];
        const refreshToken = refresh;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(loginSuccess({ accessToken, refreshToken }));
        navigate("/main");
        gtag("event", "WM_insurepro_mvp_v1_login", {
          event_category: "Employee Login",
          event_label: `설계사 PK: test`,
          // event_label: `Customer PK: ${customerPk}`,
          value: 1,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        if (error.response.data.message === "Invalid Email") {
          document.querySelector(".error_message").innerHTML =
            "등록되지 않은 이메일 주소입니다.";
        } else if (error.response.data.message === "Wrong Password") {
          document.querySelector(".error_message").innerHTML =
            "비밀번호가 일치하지 않습니다.";
        }
      } else {
        document.querySelector(".error_message").innerHTML =
          "로그인에 실패했습니다.";
      }
    }
  };
  const handleKakaoSignin = () => {
    if (!window.Kakao) {
      console.error("Kakao SDK is not initialized");
      return;
    }

    window.Kakao.Auth.login({
      success: async function (authObj) {
        try {
          // Fetch Kakao user info
          const response = await window.Kakao.API.request({
            url: "/v2/user/me",
          });

          const kakaoUserInfo = {
            id: Number(response.id),
            email: response.kakao_account.email,
            name: response.properties.nickname,
          };

          // Send the Kakao user info to the server for signup
          const serverResponse = await axios.post(
            `${MAIN_URL}/employee/kakao-signin/`,
            {
              email: kakaoUserInfo.email,
              kakaoId: kakaoUserInfo.id,
              id: kakaoUserInfo.id,
              name: kakaoUserInfo.name,
            },
          );

          if (serverResponse.status === 201) {
            // Show success message using Swal
            Swal.fire({
              html:
                "<div style='text-align: left; font-size:16px;'>" +
                "회원가입이 완료 되었습니다. 카카오 로그인으로 빠르게 시작해보세요!" +
                "</div>",
              timer: 3500,
              showConfirmButton: false,
              timerProgressBar: true,
              position: "top",
            });
          }
        } catch (error) {
          console.error("Error during Kakao signup:", error);
        }
      },
      fail: function (err) {
        console.error("Kakao signup failed:", err);
      },
    });
  };

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      console.error("Kakao SDK is not initialized");
      return;
    }

    window.Kakao.Auth.login({
      success: async function (authObj) {
        try {
          // Fetch Kakao user info
          const response = await window.Kakao.API.request({
            url: "/v2/user/me",
          });

          const kakaoUserInfo = {
            // id: response.id,
            // email: response.kakao_account.email,
            // profile: response.kakao_account.profile.nickname,
            id: Number(response.id),
            email: response.kakao_account.email,
          };

          // Send the Kakao response to the server
          const serverResponse = await axios.post(`${MAIN_URL}/kakao-login`, {
            // token: authObj.access_token,
            // user: kakaoUserInfo,
            email: kakaoUserInfo.email,
            kakaoId: kakaoUserInfo.id,
          });

          if (serverResponse.status === 200) {
            const { authorization, refresh } = serverResponse.headers;
            const accessToken = authorization.split(" ")[1];
            const refreshToken = refresh;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            dispatch(loginSuccess({ accessToken, refreshToken }));
            navigate("/main");
          }
        } catch (error) {
          console.error("Error during Kakao login:", error);
        }
      },
      fail: function (err) {
        console.error("Kakao login failed:", err);
      },
    });
  };
  return (
    <div>
      <Navbar />
      {isMobile ? (
        showMobileLogin ? (
          <div className="mt-[-76px] flex h-screen flex-col items-center justify-center bg-white">
            <div className="mb-2 text-[24px] font-semibold leading-7">
              로그인
            </div>
            <div className="mb-10 text-[14px] font-normal text-[#7D8592]">
              원활한 고객관리를 경험해보세요
            </div>
            {/* <input
              type="email"
              ref={email}
              onChange={(e) => setMyEmail(e.target.value)}
              autoFocus
              placeholder="이메일을 입력해주세요."
              className="mb-3 h-[42px] w-80 rounded border border-LightMode-Subtext pl-7"
            />
            <input
              type="password"
              ref={password}
              onChange={(e) => setMyPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요."
              className=" h-[42px] w-80  rounded border border-LightMode-Subtext pl-7"
            />
            <div className="error_message mb-[14px] text-center text-xs font-bold text-Danger-600"></div>
            <div className="mb-6 flex w-9/12 cursor-pointer justify-end text-xs text-[#7D8592]">
              <div onClick={() => navigate("/Email")} className="font-light">
                아이디 찾기 |
              </div>
              <div
                onClick={() => navigate("/Password")}
                className="pl-1 font-light"
              >
                비밀번호 찾기
              </div>
            </div> */}
            <div
              id="kakao-login-btn"
              onClick={handleKakaoSignin}
              class="mb-4"
              // style={{
              //   // width: "280px",
              //   // height: "52px",
              //   cursor: "pointer",
              //   backgroundColor: "#FEE500",
              //   padding: "10px",
              //   borderRadius: "5px",
              //   textAlign: "center",
              // }}
            >
              <img src={kakao_signin_medium_wide} />
            </div>
            <div
              id="kakao-login-btn"
              onClick={handleKakaoLogin}
              // style={{
              //   // width: "280px",
              //   height: "52px",
              //   cursor: "pointer",
              //   backgroundColor: "#FEE500",
              //   padding: "10px",
              //   borderRadius: "5px",
              //   textAlign: "center",
              // }}
            >
              <img src={kakao_login_medium_wide} />
            </div>
            {/* <div
              onClick={() => {
                if (email.current.value === "") {
                  email.current.focus();
                  document.querySelector(".error_message").innerHTML =
                    "이메일을 입력해주세요.";
                } else if (password.current.value === "") {
                  password.current.focus();
                  document.querySelector(".error_message").innerHTML =
                    "비밀번호를 입력해주세요.";
                } else {
                  onLogin();
                }
              }}
              className="mb-3 flex h-[42px] w-80 items-center justify-center rounded bg-Primary-400 p-2 text-white hover:bg-Primary-500"
            >
              로그인
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="flex h-[42px] w-80 items-center justify-center rounded border border-Primary-300 p-2 text-Primary-300 hover:border-Primary-500 hover:text-Primary-500"
            >
              회원가입
            </button> */}
          </div>
        ) : (
          <NewLogin onStart={() => setShowMobileLogin(true)} />
        )
      ) : (
        <div className="flex h-[84vh] w-full justify-center">
          <div className="login_img flex h-full w-[720px] justify-center">
            <div class="flex flex-col">
              <div class="mt-[64px] h-[64px] w-[290px]  text-[24px] font-semibold leading-8 text-white">
                고객 관리는 우리가 해줄게요. 영업에만 집중하세요.
              </div>
              <div class="flex justify-center">
                <div class="mt-3  h-[44px]  w-[180px]  text-[14px] font-medium leading-8 text-[#EBF1FF]">
                  INSUREPRO는 보험 설계사의 고객 관리를 서포팅해줍니다.
                </div>
              </div>
            </div>
          </div>
          <div className=" w-[500px] border-t bg-white px-[140px] pt-[190px]">
            <span className="mb-1 flex cursor-default  text-[24px] font-semibold">
              로그인
            </span>
            <span class="mb-6 flex text-[14px] font-normal text-[#7D8592]">
              원활한 고객관리를 경험해보세요
            </span>
            {/* <div>
              <input
                type="email"
                ref={email}
                onChange={(e) => setMyEmail(e.target.value)}
                placeholder="이메일을 입력해주세요."
                autoFocus
                className="login_input_box flex"
              />
            </div>
            <div>
              <input
                type="password"
                ref={password}
                onChange={(e) => setMyPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요."
                className="login_input_box mb-[-8px] mt-3 flex"
              />
              <div className="error_message mb-[14px] text-center text-xs font-bold text-Danger-600"></div>
            </div>
            <div className="mb-6 mr-[-60px] flex cursor-pointer justify-end text-xs text-[#7D8592]">
              <div onClick={() => navigate("/Email")} className="font-light">
                아이디 찾기 |
              </div>
              <div
                onClick={() => navigate("/Password")}
                className="pl-1 font-light"
              >
                비밀번호 찾기
              </div>
            </div> */}
            <div
              id="kakao-login-btn"
              onClick={handleKakaoSignin}
              class="mb-4"
              // class="mb-4 flex h-[52px] w-[280px] cursor-pointer items-center justify-center rounded-[5px] bg-[#FEE500] p-[10px]"
            >
              <img src={kakao_signin_large_wide} />
            </div>
            <div
              id="kakao-login-btn"
              onClick={handleKakaoLogin}
              // class="flex h-[52px] w-[280px] cursor-pointer items-center justify-center rounded-[5px] bg-[#FEE500] p-[10px]"
            >
              <img src={kakao_login_large_wide} />
            </div>
            {/* <div>
              <div
                onClick={() => {
                  if (email.current.value === "") {
                    email.current.focus();
                    document.querySelector(".error_message").innerHTML =
                      "이메일을 입력해주세요.";
                  } else if (password.current.value === "") {
                    password.current.focus();
                    document.querySelector(".error_message").innerHTML =
                      "비밀번호를 입력해주세요.";
                  } else {
                    onLogin();
                  }
                }}
                className="login_button border-gray-150 bg-primary-100 text-white"
              >
                로그인
              </div>
            </div>
            <div
              onClick={() => navigate("/signup")}
              className="signup_button border-primary-100 text-primary-100"
            >
              회원가입
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
