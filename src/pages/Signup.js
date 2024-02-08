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

  // 버튼 스타일에 대한 변경 로직
  const disabledButtonStyle = {
    backgroundColor: "var(--Gray-scale-50)", // 비활성화된 버튼의 배경색 변경
    color: "white", // 텍스트 색상을 회색으로 변경하여 비활성화 효과 적용
    cursor: "not-allowed", // 마우스 커서를 not-allowed로 변경
    border: "1px solid var(--LightMode-Background)",
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

    // selectedTeam 값에 따라 teamPk 값을 설정
    let teamPk;
    switch (currentValue) {
      case "위너 이글":
        teamPk = 1;
        break;
      case "드림 이글":
        teamPk = 2;
        break;
      case "레드 이글":
        teamPk = 3;
        break;
      default:
        console.error("팀을 선택해주세요.");
        return; // 팀이 선택되지 않았다면 함수 실행을 중단
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
          teamPk: teamPk, // 서버로 전송할 요청 본문에 teamPk 추가
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
    <div>
      <Navbar />
      <form
        name="file"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        class="flex h-screen justify-center bg-LightMode-SectionBackground pt-[76px]"
      >
        <div style={{ width: "780px" }}>
          <div
            class="cursor-default font-semibold"
            style={{ marginTop: "57px", marginBottom: "30px" }}
          >
            {" "}
            회원가입
          </div>
          <div class="mb-6 cursor-default  text-right text-xs font-light text-LightMode-Text">
            <span className="Highlighting">*</span>
            필수입력사항
          </div>
          <hr className="signin_hr1" />
          <div
            style={{
              width: "780px",
              height: "344px",
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
              {/* {verificationMessage && (
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
              )} */}
            </div>
            <div class="mb-3 flex">
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
            <div class="mb-3 flex">
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
            <div class="flex">
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
          <hr className="signin_hr2" />
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
          <hr className="signin_hr3" />
          <div class="flex flex-col items-center justify-center">
            <div className="error_message mb-[15px] text-xs font-bold text-Danger-600"></div>
            <button
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
              class="mb-3 flex h-[42px] w-[280px] items-center justify-center rounded bg-Primary-400 py-[10px] font-semibold text-white "
            >
              가입하기
            </button>
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
  border: 1px solid var(--Gray-scale-50);
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  &::before {
    content: "⌵";
    position: absolute;
    top: 6px;
    right: 20px;
    color: var(--LightMode-Subtext);
    font-size: 20px;
  }
`;
const Label = styled.label`
  font-size: 14px;
  text-align: center;
  color: var(--LightMode-Subtext);
`;
const SelectOptions = styled.ul`
  position: absolute;
  overflow: hidden;
  top: 40px;
  left: 0;
  width: 100%;
  height: 114px;
  font-weight: 300;
  max-height: ${(props) => (props.show ? "none" : "0")};
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid var(--Gray-scale-50);
  color: var(--LightMode-Subtext);
`;
const Option = styled.li`
  font-size: 14px;
  display: flex;
  align-item: start;
  padding: 12px 20px;
  transition: background-color 0.2s ease-in;
  &:hover {
    font-weight: 600;
    background-color: var(--LightMode-Hover);
    color: var(--LightMode-Text);
  }
`;
