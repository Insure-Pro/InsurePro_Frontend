import axios from "axios";
// import { jwtDecode } from "jwt-decode";
import { decode as jwtDecode } from "jwt-decode";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import styled from "styled-components";
import Navbar from "../components/Navbar";

const Login = () => {
  const email = useRef("");
  const password = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [myEmail, setMyEmail] = useState("");
  const [myPassword, setMyPassword] = useState("");

  const imageUrl = process.env.PUBLIC_URL + "/loginImg.png";

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const onLogin = () => {
    axios
      .post(`${MAIN_URL}/login`, {
        email: email.current.value,
        password: password.current.value,
      })
      .then((response) => {
        if (response.status == 200) {
          const { authorization, refresh } = response.headers;

          localStorage.setItem("accessToken", authorization.split(" ")[1]);
          localStorage.setItem("refreshToken", refresh);

          dispatch(
            loginSuccess({
              accessToken: authorization,
              refreshToken: refresh,
            }),
          );

          navigate("/main");
        }
      })
      .catch((error) => {
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
      });
  };

  const handleLogin = async (credentials) => {
    // 로그인 처리 로직
    // console.log("Login Attempt with", credentials);
    // // 로그인 성공 후
    // console.log("Login Successful. Redirecting to main page.");
    // // 리다이렉트 로직
  };

  return (
    <div>
      <Navbar />
      <div class="flex h-[100vh]  justify-center  bg-LightMode-SectionBackground pt-[214px]">
        <div class="h-[354px] w-[356px] rounded-md border border-Gray-scale-300 bg-white px-9 py-6">
          <span
            class="mb-6 flex  cursor-default justify-center font-semibold"
            style={{
              fontSize: "17px",
            }}
          >
            {" "}
            로그인
          </span>

          <div>
            <input
              type="email"
              ref={email}
              onChange={(e) => {
                setMyEmail(e.target.value);
              }}
              placeholder="이메일을 입력해주세요."
              autoFocus
              className="login_input_box"
            />
          </div>
          <div>
            <input
              type="password"
              ref={password}
              onChange={(e) => {
                setMyPassword(e.target.value);
              }}
              placeholder="비밀번호를 입력해주세요."
              className="login_input_box my-3"
            />
            <div class="error_message mb-[14px] text-center text-xs font-bold text-Danger-600 "></div>
          </div>
          <div class="mb-6 flex cursor-pointer justify-end text-xs">
            <div onClick={() => navigate("/Email")} class="font-light">
              아이디 찾기 |
            </div>
            <div onClick={() => navigate("/Password")} class="pl-1 font-light">
              {" "}
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
              className="login_button  border-gray-150 bg-primary-100 text-white"
            >
              로그인
            </div>
          </div>
          <div
            onClick={() => navigate("/signup")}
            class="signup_button   border-primary-100  text-primary-100"
          >
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
