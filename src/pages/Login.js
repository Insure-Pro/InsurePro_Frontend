import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/buttons/Button";
import Header from "../components/Header";

const Login = () => {
  const email = useRef("");
  const password = useRef(null);
  const navigate = useNavigate();

  const onLogin = () => {
    axios
      .post("http://52.79.81.200:8080/v1/login", {
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
          src="https://s3-alpha-sig.figma.com/img/2dcb/5471/483fecfc239e20faeb2c0d8321de25da?Expires=1695600000&Signature=OHO4ZcrLIzjxEIXeFjs~rQ-~llGH4GPqxmuEtiiAU24ggbE5OLqpWhWjj~qoPBo2mUltQxMeTxNoxE5W6SXghVVCC0ldmIQIaQTwvqaqv7jGYB8btoE-3jp9Ut0Secgy312UTA7SS~-UP9SNYiL9YEbbRH6octf9rU3g-LJodVo5Em2AKfh9o~DESasRsF3DaWs84EKw-TMh48KS6w~EjUNDAerN7Pt46~GBTFJZTSvO4k1sXKZMlW9mxWvO2d5cGYttkeYqgSh74WP9eLG-MiKevD47VvtOyxLU7MoYBuvm~zfCcf3mCcvr5Zi-91EEtpHmfZSEJRAmVDP4d4YPlQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
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
          <h1 style={{ display: "flex", color: "#000000" }}> 로그인</h1>
          <h3 style={{ display: "flex", color: "#000000", opacity: "0.7" }}>
            아직 회원이 아니신가요?
          </h3>
          <h3
            style={{ display: "flex", color: "#175CD3", marginBottom: "50px" }}
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
          <Button
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
          >
            로그인
          </Button>
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
    margin-left: 10px;
    color: #98a2b3;
    opacity: 0.9;
  }
  .error_message {
    color: red;
    font-size: 18px;
  }
`;

const StyledButtonDiv = styled.div`
  border-radius: 32px;
  display: flex;
  width: 30vw;
  align-items: center;
  background-color: #175cd3;

  margin: auto;
  box-shadow: 0.5px 0.5px 12px grey;
`;

const StyledSocialButtonDiv = styled.div`
  width: 180px;
  margin: ${(props) => props.margin || "auto"};
`;

const StyledSocialButton = styled.img`
  position: relative;
  margin: 10px auto;
  height: 35px;
  width: 180px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
`;

export default Login;
