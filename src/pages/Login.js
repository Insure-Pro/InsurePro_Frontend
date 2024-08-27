import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import Navbar from "../components/Main/Navbar/Navbar";
import { useMediaQuery } from "react-responsive";
import NewLogin from "./NewLogin";

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
            <input
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
            </div>
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
              className="mb-3 flex h-[42px] w-80 items-center justify-center rounded bg-Primary-400 p-2 text-white hover:bg-Primary-500"
            >
              로그인
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="flex h-[42px] w-80 items-center justify-center rounded border border-Primary-300 p-2 text-Primary-300 hover:border-Primary-500 hover:text-Primary-500"
            >
              회원가입
            </button>
          </div>
        ) : (
          <NewLogin onStart={() => setShowMobileLogin(true)} />
        )
      ) : (
        <div className="flex h-[100vh] w-full justify-center">
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
          <div className="h-full w-[500px] border-t bg-white px-[140px] pt-[190px]">
            <span className="mb-1 flex cursor-default  text-[24px] font-semibold">
              로그인
            </span>
            <span class="mb-6 flex text-[14px] font-normal text-[#7D8592]">
              원활한 고객관리를 경험해보세요
            </span>
            <div>
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
            </div>
            <div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
