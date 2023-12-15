import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
            })
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
    <div style={{}}>
      <Navbar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "1024px",
          height: "100vh",
          backgroundColor: "#F3F3F3",
        }}
      >
        <div
          style={{
            width: "356px",
            height: "354px",
            padding: "24px 36px",
            borderRadius: "6px",
            backgroundColor: "#fff",
          }}
        >
          <span
            class="font-semibold cursor-default"
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "17px",
              marginBottom: "24px",
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
              class="font-light"
              style={{
                width: "280px",
                height: "42px",
                padding: "12px 20px",
                fontSize: "14px",
                border: "1px solid #B8B8B8",
                borderRadius: "4px",
              }}
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
              class="font-light"
              style={{
                width: "280px",
                height: "42px",
                margin: "12px 0px",
                padding: "12px 20px",
                fontSize: "14px",
                border: "1px solid #B8B8B8",
                borderRadius: "4px",
              }}
            />
            <div
              className="error_message"
              style={{ marginTop: "-20px", paddingBottom: "20px" }}
            ></div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "24px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <div onClick={() => navigate("/Email")} class="font-light">
              아이디 찾기 |
            </div>
            <div
              onClick={() => navigate("/Password")}
              class="font-light"
              style={{ paddingLeft: "4px" }}
            >
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
              class="font-semibold cursor-pointer"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "280px",
                height: "42px",
                padding: "10px 0px",
                marginBottom: "12px",
                border: "1px solid #B8B8B8",
                borderRadius: "4px",
                backgroundColor: "#B61865",
                color: "#fff",
              }}
            >
              로그인
            </div>
          </div>
          <div
            onClick={() => navigate("/signup")}
            class="font-semibold cursor-pointer"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "280px",
              height: "42px",
              padding: "10px 0px",
              marginBottom: "12px",
              border: "1px solid #B61865",
              borderRadius: "4px",
              color: "#B61865",
            }}
          >
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
