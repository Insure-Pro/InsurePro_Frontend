import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const Signup = () => {
  const fileRef = useRef("");
  const userName = useRef("");
  const email = useRef("");
  const usernum = useRef("");
  const authNum = useRef("");
  const authNumConfirm = useRef("");
  const password = useRef("");
  const passwordConfirm = useRef("");
  const navigate = useNavigate();

  const [verificationMessage, setVerificationMessage] = useState(null);
  const [isVerified, setIsVerified] = useState(false); // 인증이 완료되었는지 확인하는 상태 추가
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState("팀 선택");

  const initial_icon = process.env.PUBLIC_URL + "/initial_icon.png";
  const imageUrl = process.env.PUBLIC_URL + "/loginImg.png";
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
      });
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
    border: "1px solid var(--primary-100)",
    color: `var(--primary-100)`,
    backgroundColor: "#fff",
    fontSize: "14px",
  };

  // isCodeSent가 true일 때의 배경색 스타일
  const activeButtonStyle = isCodeSent
    ? { color: "#fff", backgroundColor: "var(--primary-100)" }
    : { color: "var(--gray-150)", border: "1px solid var(--gray-150)" };

  // 두 스타일 객체를 합칩니다.
  const confirmButtonStyle = { ...baseButtonStyle, ...activeButtonStyle };

  const sendCodeButtonText = isCodeSent ? "재전송" : "인증번호 받기";

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (validate()) {
      axios
        .post(`${MAIN_URL}/employee/signin`, {
          name: userName.current.value,
          email: email.current.value,
          id: usernum.current.value,
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
          } else if (response.status === 201) {
            alert("회원가입이 완료되었습니다.");
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

  const handleChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const [currentValue, setCurrentValue] = useState("팀 선택");
  const [showOptions, setShowOptions] = useState(false);

  const handleOnChangeSelectValue = (e) => {
    const { innerText } = e.target;
    setCurrentValue(innerText);
  };

  return (
    <div style={{}}>
      <Navbar />
      <form
        name="file"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        class="w-1024px flex justify-center"
        style={{
          height: "100vh",
          backgroundColor: "#F3F3F3",
        }}
      >
        <div style={{ width: "780px" }}>
          <div
            class="cursor-default font-semibold"
            style={{ marginTop: "57px", marginBottom: "30px" }}
          >
            {" "}
            회원가입
          </div>
          <div
            class="cursor-default font-light"
            style={{ textAlign: "right", fontSize: "12px" }}
          >
            <span className="Highlighting">*</span>
            필수입력사항
          </div>
          <hr className="signin_hr" class="mb-7" />
          <div
            style={{
              width: "780px",
              height: "356px",
              marginLeft: "78px",
            }}
          >
            <div>
              <div class="mb-3 flex">
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
                  className="signin_input_box mr-4"
                />
                <button
                  className="signin_code_button"
                  class="font-light"
                  type="button"
                  onClick={handleSendCodeClick}
                  style={baseButtonStyle}
                >
                  {sendCodeButtonText}
                </button>
              </div>
            </div>

            <div>
              <div
                class="mb-3 flex"
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
                />
                <button
                  className="signin_code_button"
                  class="font-light"
                  style={confirmButtonStyle}
                  disabled={!isCodeSent}
                  onClick={handleVerifyClick}
                >
                  확인
                </button>
              </div>
              {verificationMessage && (
                <div
                  style={{
                    color: isVerified ? "blue" : "red",
                    fontSize: "12px",
                    marginTop: "-12px",
                    textAlign: "center",
                  }}
                >
                  {verificationMessage}
                </div>
              )}
            </div>
            <div
              class="mb-3 flex"
              // style={{
              //   marginBottom: "16px",
              // }}
            >
              <span className="signin_span">
                <span className="Highlighting">*</span>
                비밀번호
              </span>
              <input
                type="password"
                ref={password}
                placeholder="비밀번호를 입력해주세요"
                value={myPassword}
                autocomplete="new-password"
                onChange={(e) => {
                  setMyPassword(e.target.value);
                }}
                className="signin_input_box"
              />
            </div>
            <div
              class="mb-3 flex"
              // style={{
              //   marginBottom: "16px",
              // }}
            >
              <span className="signin_span">
                <span className="Highlighting">*</span>
                비밀번호 확인
              </span>
              <input
                type="password"
                ref={passwordConfirm}
                placeholder="비밀번호 재입력"
                className="signin_input_box"
              />

              <div
                className="error_message"
                style={{
                  fontSize: "16px",
                  paddingTop: "20px",
                  marginBottom: "-20px",
                }}
              ></div>
            </div>
            <div class="mb-3 flex ">
              <span className="signin_span">
                <span className="Highlighting">*</span>
                이름
              </span>
              <input
                type="name"
                ref={userName}
                placeholder="사원이름 입력하기"
                className="signin_input_box"
              />
            </div>
            <div class="mb-3 flex">
              <span className="signin_span">
                <span className="Highlighting">*</span>
                사원번호
              </span>
              <input
                type="text"
                ref={usernum}
                placeholder="사원번호 입력하기"
                className="signin_input_box"
              />
            </div>
          </div>
          <hr className="signin_hr" class="mt-0" />
          <div
            class="flex items-center "
            style={{
              width: "780px",
              height: "42px",
              alignItems: "center",
              margin: " 24px 0px 24px 78px",
            }}
          >
            <span className="signin_span pl-[10px]">팀 선택</span>
            <SelectBox onClick={() => setShowOptions((prev) => !prev)}>
              <Label>{currentValue}</Label>
              <SelectOptions
                value={selectedTeam}
                onChange={handleChange}
                show={showOptions}
              >
                <Option onClick={handleOnChangeSelectValue} value="위너 이글">
                  위너 이글
                </Option>
                <Option onClick={handleOnChangeSelectValue} value="드림 이글">
                  드림 이글
                </Option>
                <Option onClick={handleOnChangeSelectValue} value="레드 이글">
                  래드 이글
                </Option>
              </SelectOptions>
            </SelectBox>
          </div>
          <hr className="signin_hr" class="mb-12 mt-0" />
          <div class="flex justify-center">
            <div
              onClick={() => {
                if (email.current.value === "") {
                  email.current.focus();
                  document.querySelector(".error_message").innerHTML =
                    "이메일을 입력해주세요.";
                  return;
                } else if (usernum.current.value === "") {
                  usernum.current.focus();
                  document.querySelector(".error_message").innerHTML =
                    "사번을 입력해주세요.";
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
              class="bg-primary-100 mb-3 flex h-[42px] w-[280px] items-center justify-center rounded py-[10px] font-semibold text-white "
            >
              가입하기
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;

const SelectBox = styled.div`
  position: relative;
  display: flex;
  align-item: start;
  font-weight: 300;
  width: 360px;
  height: 42px;
  padding: 12px 20px;
  border: 1px solid #b8b8b8;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  &::before {
    content: "⌵";
    position: absolute;
    top: 1px;
    right: 20px;
    color: #49c181;
    font-size: 20px;
  }
`;
const Label = styled.label`
  font-size: 14px;
  text-align: center;
  color: #a0a7b2;
`;
const SelectOptions = styled.ul`
  position: absolute;
  list-style: none;
  top: 42px;
  left: 0;
  width: 100%;
  overflow: hidden;
  height: 138px;
  max-height: ${(props) => (props.show ? "none" : "0")};
  padding: 0;
  border-radius: 4px;
  background-color: #222222;
  color: #fefefe;
`;
const Option = styled.li`
  font-size: 14px;
  display: flex;
  align-item: start;
  padding: 12px 20px;
  transition: background-color 0.2s ease-in;
  &:hover {
    background-color: #595959;
  }
`;
