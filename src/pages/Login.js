import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/buttons/Button";
import Header from "../components/Header";
import LoginImg from "../external/image 14.png";

const Login = () => {
  const email = useRef("");
  const password = useRef(null);
  const navigate = useNavigate();

  const onLogin = () => {
    axios
      .post(" http://3.38.101.62:8080/v1/login", {
        email: email.current.value,
        password: password.current.value,
      })
      .then((response) => {
        if (response.status == 200) {
          const { authorization, refresh } = response.headers;

          if (authorization && refresh) {
            localStorage.setItem("accessToken", authorization);
            localStorage.setItem("refreshToken", refresh);
            navigate("/main");
          } else {
            console.log(response.headers);
            console.warn(
              "Authorization and Refresh headers are missing in the response!"
            );
          }
        } else {
          alert(
            "서버와 연결에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
          );
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("서버와 연결에 실패했습니다.");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vw",
      }}
    >
      <div>
        <img
          src={LoginImg}
          style={{
            width: "60vw",
            height: "60vw",
          }}
        />
      </div>
      <div style={{ marginTop: "110px", width: "50vw", height: "100vw" }}>
        {/* <Header /> */}
        {/* <StyledSpan>로그인</StyledSpan> */}
        <StyledInputDiv>
          <h1
            style={{
              display: "flex",
              color: "#000000",
              fontWeight: "bold",
              marginLeft: "30px",
              marginBottom: "30px",
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
            }}
          >
            아직 회원이 아니신가요?
          </h3>
          <h3
            style={{
              display: "flex",
              color: "#175CD3",
              marginBottom: "50px",
              cursor: "pointer",
              marginLeft: "30px",
            }}
            onClick={() => navigate("/signup")}
          >
            회원가입 하러가기!
          </h3>
          <div>
            <span style={{ display: "flex" }}>Email</span>
            <input
              style={{ display: "flex" }}
              type="email"
              ref={email}
              placeholder="이메일을 입력해주세요."
              autoFocus
            />
          </div>
          <div>
            <span style={{ display: "flex" }}>Password</span>
            <input
              style={{ display: "flex" }}
              type="password"
              ref={password}
              placeholder="비밀번호를 입력해주세요."
            />
            <div className="error_message"></div>
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
            value="로그인"
          />
        </StyledButtonDiv>
      </div>
    </div>
  );
};

const StyledSpan = styled.span`
  font-family: "Do Hyeon", sans-serif;
  font-size: 30px;
  color: #555;
`;

const StyledInputDiv = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  color: #aaa;
  margin: 5vh auto 20px;
  margin-top: 70px;
  padding: 20px 10px;
  width: 30vw;

  border-radius: 15px;
  input {
    width: 25vw;
    height: 30px;
    margin: 8px 5px;
    margin-left: 30px;
    margin-bottom: 30px;
    color: #000000;
    opacity: 0.8;
    font-size: 16px;
    font-weight: bold;
    outline: none;
    border: none;
    border-bottom: 1px solid #ddd;
  }
  span {
    font-family: "Do Hyeon", sans-serif;
    font-size: 17px;
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
  width: 35vw;
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
  width: 27vw;
  align-items: center;
  background-color: #175cd3;
  color: #fff;
  box-shadow: 0.5px 0.5px 12px grey;
  margin: ${(props) => props.margin || "auto"};
`;

export default Login;
