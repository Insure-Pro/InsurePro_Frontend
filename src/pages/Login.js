import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import styled from "styled-components";

const Login = () => {
  const email = useRef("");
  const password = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [myEmail, setMyEmail] = useState("");
  const [myPassword, setMyPassword] = useState("");

  const imageUrl = process.env.PUBLIC_URL + "/loginImg.png";

  const onLogin = () => {
    axios
      .post("https://www.insurepro.kro.kr/v1/login", {
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
          // refreshTokenIfNeeded().then(() => {
          navigate("/main");
          // });
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "1360px",
        margin: "0 auto",
        height: "970px",
        borderRight: "2px solid #dde1e6",
      }}
    >
      <div>
        <img
          src={imageUrl}
          style={{
            width: "800px",
            height: "970px",
          }}
        />
      </div>
      <div style={{ paddingTop: "110px", width: "560px", height: "970px" }}>
        {/* <Header /> */}
        {/* <StyledSpan>로그인</StyledSpan> */}
        <StyledInputDiv>
          <h1
            style={{
              display: "flex",
              color: "#000000",
              marginLeft: "30px",
              fontWeight: "bold",
              fontSize: "34px",
              marginBottom: "30px",
              cursor: "default",
            }}
          >
            {" "}
            로그인
          </h1>
          <h3
            style={{
              display: "flex",
              color: "#000000",
              opacity: "0.7",
              marginLeft: "30px",
              fontSize: "20px",
              fontWeight: "700",
              cursor: "default",
            }}
          >
            아직 회원이 아니신가요?
          </h3>

          <h3
            style={{
              display: "flex",
              color: "#175CD3",
              marginBottom: "50px",
              marginLeft: "30px",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "700",
            }}
            onClick={() => navigate("/signup")}
          >
            회원가입 하러가기!
          </h3>
          <div>
            <span
              style={{ display: "flex", fontSize: "20px", cursor: "default" }}
            >
              Email
            </span>
            <input
              style={{ display: "flex" }}
              type="email"
              ref={email}
              // defaultValue={myEmail}
              onChange={(e) => {
                setMyEmail(e.target.value);
              }}
              placeholder="이메일을 입력해주세요."
              autoFocus
            />
          </div>
          <div>
            <span
              style={{ display: "flex", fontSize: "20px", cursor: "default" }}
            >
              Password
            </span>
            <input
              style={{ display: "flex" }}
              type="password"
              ref={password}
              // defaultValue={myPassword}
              onChange={(e) => {
                setMyPassword(e.target.value);
              }}
              placeholder="비밀번호를 입력해주세요."
            />
            <div
              className="error_message"
              style={{ marginTop: "-20px", paddingBottom: "20px" }}
            ></div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              color: "#000",
              marginTop: "-16px",
              marginBottom: "-12px",
              paddingRight: "30px",
              alignItems: "end",
            }}
          >
            <div
              style={{
                color: "#98a2b3",
                marginBottom: "4px",
                fontSize: "14px",
              }}
              onClick={() => navigate("/Email")}
            >
              아이디 찾기
            </div>
            <div
              style={{ color: "#98a2b3", fontSize: "14px" }}
              onClick={() => navigate("/Password")}
            >
              비밀번호 찾기
            </div>
          </div>
        </StyledInputDiv>
        <StyledButtonDiv>
          <StyledInput
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
            defaultValue="로그인"
          />
        </StyledButtonDiv>
      </div>
    </div>
  );
};

const StyledInputDiv = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  color: #aaa;
  margin: 5vh auto 20px;
  margin-top: 70px;
  padding: 20px 10px;
  width: 460px;
  border-radius: 15px;

  input {
    width: 380px;
    height: 30px;
    margin: 8px 5px;
    margin-left: 30px;
    margin-bottom: 30px;
    color: #000000;
    opacity: 0.8;
    font-size: 20px;
    font-weight: bold;
    outline: none;
    border: none;
    border-bottom: 1px solid #ddd;
  }
  span {
    font-family: "Do Hyeon", sans-serif;
    font-size: 20px;
    font-weight: bold;

    margin: 2px;
    margin-left: 30px;
    color: #98a2b3;
    opacity: 0.9;
  }
  .error_message {
    color: red;
    font-size: 18px;
  }
`;
//?왜 밑에꺼랑 이거랑 둘 다 가입하기 버튼 수정하는지?
const StyledInput = styled.input`
  font-size: 25px;
  font-family: "Do Hyeon", sans-serif;
  width: 430px;
  height: 40px;
  border: none;
  font-weight: bold;
  text-align: center;
  background-color: transparent;
  margin: 10px;
  color: #fff;
  cursor: pointer;
`;
//현재 로그인 버튼
const StyledButtonDiv = styled.div`
  border-radius: 32px;
  display: flex;
  width: 400px;
  align-items: center;
  background-color: #175cd3;
  color: #fff;
  box-shadow: 0.5px 0.5px 12px grey;
  margin: ${(props) => props.margin || "auto"};
`;

export default Login;
