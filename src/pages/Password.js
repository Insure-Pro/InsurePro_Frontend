import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Main/Navbar/Navbar";

const Password = () => {
  const email = useRef("");
  const authNum = useRef("");
  const authNumConfirm = useRef("");
  const password = useRef("");
  const passwordConfirm = useRef("");
  const navigate = useNavigate();

  const [verificationMessage, setVerificationMessage] = useState(null);
  const [isVerified, setIsVerified] = useState(false); // 인증이 완료되었는지 확인하는 상태 추가

  const [isCodeSent, setIsCodeSent] = useState(false);

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleVerifyClick = () => {
    if (myAuthNum === parseInt(authNumConfirm.current.value)) {
      setIsVerified(true);
      setVerificationMessage("본인 인증이 완료되었습니다");
    } else {
      setIsVerified(false);
      setVerificationMessage("본인 인증에 실패하였습니다");
    }
  };

  const handleSendCodeClick = () => {
    axios
      .post(`${MAIN_URL}/email`, {
        email: myEmail,
      })
      .then((response) => {
        setMyAuthNum(response.data.authNum);
        setIsCodeSent(true); // 코드가 성공적으로 전송되었을 때만 상태를 true로 변경합니다.
      })
      .catch((error) => {
        console.error("Error sending code:", error);
        // 에러 핸들링 로직을 여기에 추가할 수 있습니다.
      });
  };

  // 버튼 스타일에 대한 변경 로직
  const disabledButtonStyle = {
    backgroundColor: "var(--Gray-scale-50)", // 비활성화된 버튼의 배경색 변경
    color: "white", // 텍스트 색상을 회색으로 변경하여 비활성화 효과 적용
    cursor: "not-allowed", // 마우스 커서를 not-allowed로 변경
    border: "1px solid var(--LightMode-Background)",
  };

  // 기존 스타일
  const baseButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "120px",
    height: "42px",
    padding: "12px 0px",
    borderRadius: "4px",
    border: "1px solid var(--Primary-300)",
    color: `var(--Primary-300)`,
    backgroundColor: "#fff",
    fontSize: "14px",
  };

  // isCodeSent가 true일 때의 배경색 스타일
  const activeButtonStyle = isCodeSent
    ? {
        color: "#fff",
        fontWeight: "700",
        backgroundColor: "var(--Primary-300)",
      }
    : {
        color: "var(--LightMode-Background)",
        border: "1px solid #fff",
        backgroundColor: "var(--Gray-scale-50)",
      };

  // 두 스타일 객체를 합칩니다.
  const confirmButtonStyle = { ...baseButtonStyle, ...activeButtonStyle };

  const sendCodeButtonText = isCodeSent ? "재전송" : "인증번호 받기";

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (validate()) {
      axios
        .patch(`${MAIN_URL}/employee/password`, {
          email: email.current.value,
          password: password.current.value,
          rePassword: passwordConfirm.current.value,
          authNum: parseInt(authNumConfirm.current.value),
        })
        .then((response) => {
          // console.log(response);
          if (response.data.error === "DUPLICATE_EMAIL") {
            email.current.focus();
            document.querySelector(".error_message").innerHTML =
              "이미 가입된 이메일입니다.";
          } else if (response.status === 200) {
            alert("비밀번호 변경이 완료되었습니다.");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("API 요청 에러:", error.message);

          if (error.response) {
            // 서버 응답이 있을 때
            if (error.response.status === 500) {
              console.error("서버 오류 발생");
              // 서버 오류에 대한 처리를 수행하거나 사용자에게 알림을 표시
            } else {
              // 다른 상태 코드에 대한 처리
              console.error("서버 응답:", error.response.data);
              // 사용자에게 에러 메시지를 표시
            }
          } else {
            // 서버 응답이 없을 때 (네트워크 오류 등)
            console.error("네트워크 오류:", error.message);
            // 사용자에게 네트워크 오류를 알림
          }
        });
    }
  };

  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$",
  );
  const validPassword = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$");

  const [myEmail, setMyEmail] = useState("");
  const [myAuthNum, setMyAuthNum] = useState("");
  const [myPassword, setMyPassword] = useState("");

  const validate = () => {
    if (!validEmail.test(myEmail)) {
      email.current.focus();
      document.querySelector(".error_message").innerHTML =
        "이메일 형식이 올바르지 않습니다.";
    } else if (myPassword && !validPassword.test(myPassword)) {
      password.current.focus();
      document.querySelector(".error_message").innerHTML =
        "비밀번호는 영소문자 숫자 특수문자 혼합 8자 이상 입력해주세요.";
    } else if (password.current.value !== passwordConfirm.current.value) {
      passwordConfirm.current.focus();
      document.querySelector(".error_message").innerHTML =
        "비밀번호가 일치하지 않습니다.";
    } else {
      document.querySelector(".error_message").innerHTML = "";
      return true;
    }
  };

  return (
    <div>
      <Navbar />
      <form
        name="file"
        encType="multipart/form-data"
        class="flex h-screen justify-center bg-LightMode-SectionBackground pt-[76px]"
        onSubmit={handleSubmit}
      >
        <div style={{ width: "780px" }}>
          {" "}
          <div class="mb-[68px] mt-[57px] flex justify-center text-[17px] font-semibold text-LightMode-Text">
            비밀번호 찾기
          </div>
          <div class="flex w-full items-center justify-center">
            <hr className="signin_hr0 " />
          </div>
          <div
            style={{
              width: "780px",
              height: "344px",
              marginLeft: "78px",
            }}
          >
            <div>
              <div class="mb-4 mt-7 flex">
                <span className="signin_span">
                  <span className="Highlighting">*</span>
                  이메일
                </span>
                <input
                  type="email"
                  ref={email}
                  value={myEmail}
                  onChange={(e) => {
                    setMyEmail(e.target.value);
                  }}
                  placeholder="이메일을 입력해주세요"
                  disabled={isVerified} // 본인 인증이 완료되면 비활성화
                  className="signin_input_box mr-4"
                />
                <button
                  className="signin_code_button"
                  class="font-light"
                  type="button"
                  onClick={handleSendCodeClick}
                  disabled={isVerified} // 본인 인증이 완료되면 비활성화
                  style={
                    isVerified
                      ? { ...baseButtonStyle, ...disabledButtonStyle }
                      : baseButtonStyle
                  }
                >
                  {sendCodeButtonText}
                </button>
              </div>
            </div>

            <div>
              <div
                class="mb-4 flex"
                style={{
                  flexDirection: "row",
                }}
              >
                <input
                  type="authNum"
                  ref={authNumConfirm}
                  placeholder="본인 인증 코드를 입력해주세요"
                  className="signin_input_box mr-4"
                  style={{
                    marginLeft: "127px",
                  }}
                  disabled={isVerified} // 본인 인증이 완료되면 비활성화
                />
                <button
                  className="signin_code_button"
                  class="font-light"
                  // style={confirmButtonStyle}
                  // disabled={!isCodeSent}
                  disabled={isVerified && !isCodeSent} // 본인 인증이 완료되면 비활성화
                  style={
                    isVerified
                      ? { ...confirmButtonStyle, ...disabledButtonStyle }
                      : confirmButtonStyle
                  }
                  onClick={handleVerifyClick}
                >
                  확인
                </button>
              </div>
            </div>
            <div class="mb-4 flex">
              <span className="signin_span">
                <span className="Highlighting">*</span>
                비밀번호
              </span>
              <input
                type="password"
                ref={password}
                placeholder="새로운 비밀번호를 입력해주세요"
                value={myPassword}
                autocomplete="new-password"
                onChange={(e) => {
                  setMyPassword(e.target.value);
                }}
                className="signin_input_box"
              />
            </div>
            <div class="mb-9 flex">
              <span className="signin_span">
                <span className="Highlighting">*</span>
                비밀번호 확인
              </span>
              <input
                type="password"
                ref={passwordConfirm}
                placeholder="비밀번호를 한번 더 입력해주세요"
                className="signin_input_box"
              />
            </div>
            <div class="ml-[-78px]  flex w-full flex-col items-center justify-center">
              <div className="error_message mb-[15px] text-xs font-bold text-Danger-600"></div>
              <button
                onClick={() => {
                  if (email.current.value === "") {
                    email.current.focus();
                    document.querySelector(".error_message").innerHTML =
                      "이메일을 입력해주세요.";
                    return;
                  } else if (authNumConfirm.current.value === "") {
                    authNum.current.focus();
                    document.querySelector(".error_message").innerHTML =
                      "인증 코드를 입력해주세요.";
                    return;
                  } else if (password.current.value === "") {
                    password.current.focus();
                    document.querySelector(".error_message").innerHTML =
                      "비밀번호를 입력해주세요.";
                    return;
                  } else if (passwordConfirm.current.value === "") {
                    password.current.focus();
                    document.querySelector(".error_message").innerHTML =
                      "비밀번호 확인을 입력해주세요.";
                    return;
                  } else {
                    document.querySelector(".error_message").innerHTML = "";
                  }
                }}
                type="submit"
                value="로그인 하러 가기"
                class="mb-3 flex h-[42px] w-[280px] items-center justify-center rounded bg-Primary-400 py-[10px] font-semibold text-white "
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const div = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  color: #aaa;
  margin: 5vh auto 20px;
  margin-top: 60px;
  padding: 20px 10px;
  width: 460px;
  border-radius: 15px;

  input {
    width: 380px;
    height: 30px;
    margin: 8px 5px;
    margin-left: 6px;
    margin-bottom: 15px;

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
  width: 430px;
  height: 40px;
  border: none;
  font-weight: bold;

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

export default Password;
