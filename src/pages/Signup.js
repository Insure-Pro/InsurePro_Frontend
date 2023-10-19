import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import LoginImg from "../external/loginImg.png";
// import LoginImg from "../../public/loginImg.png";

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

  const imageUrl = process.env.PUBLIC_URL + "/loginImg.png";

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
      .post("http://3.38.101.62:8080/v1/email", {
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

  // 기존 스타일
  const baseButtonStyle = {
    position: "absolute",
    width: "70px",
    height: "28px",
    fontWeight: "bold",
    // textAlign: "center",
    paddingTop: "3px",
    fontSize: "16px",
    right: "5px",
    margin: "8px 5px",
    marginBottom: "30px",
    marginRight: "35px",
    borderRadius: "3px",
    border: "none",
    color: "#FFF",
    backgroundColor: "#98A2B3",
  };

  // isCodeSent가 true일 때의 배경색 스타일
  const activeButtonStyle = isCodeSent ? { backgroundColor: "#175CD3" } : {};

  // 두 스타일 객체를 합칩니다.
  const confirmButtonStyle = { ...baseButtonStyle, ...activeButtonStyle };

  // const confirmButtonStyle = isCodeSent
  //   ? { backgroundColor: 'blue' }
  //   : { backgroundColor: 'grey' };

  const sendCodeButtonText = isCodeSent ? "재전송" : "코드전송";

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    // const formData = new FormData();
    const data = {
      name: userName.current.value,
      email: email.current.value,
      id: usernum.current.value,
      password: password.current.value,
      rePassword: passwordConfirm.current.value,
      // companyPk: 2,// 이거 pk2로 설정 해놨으면서 챰내
      authNum: parseInt(authNumConfirm.current.value),
    };

    // formData.append("file", fileRef.current.files[0]);
    // formData.append(
    //   "joinData",
    //   new Blob([JSON.stringify(data)], { type: "application/json" })
    // );
    // "proxy": "http://localhost:8080" package.json 아직 효과 x
    if (validate()) {
      axios
        .post("http://3.38.101.62:8080/v1/employee/signin/", {
          name: userName.current.value,
          email: email.current.value,
          id: usernum.current.value,
          password: password.current.value,
          rePassword: passwordConfirm.current.value,
          // companyPk: 2,//
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
          // console.log({ data });
        });
    }
  };

  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
  );
  const validPassword = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$");
  const [userNameValue, setUserNameValue] = useState(""); // 상태를 관리하기 위한 useState 훅
  const [myEmail, setMyEmail] = useState("");
  const [myAuthNum, setMyAuthNum] = useState("");
  const [myPassword, setMyPassword] = useState("");

  const validate = () => {
    if (!validEmail.test(myEmail)) {
      email.current.focus();
      document.querySelector(".error_message").innerHTML =
        "이메일 형식이 올바르지 않습니다.";
    }
    // else if (myAuthNum !== authNumConfirm.current.value) {
    //   authNumConfirm.current.focus();
    //   document.querySelector(".error_message").innerHTML =
    //     "인증코드가 불일치합니다.";
    // }
    else if (!validPassword.test(myPassword)) {
      password.current.focus();
      document.querySelector(".error_message").innerHTML =
        "비밀번호는 영소문자 숫자 특수문자 혼합 8자 이상 입력해주세요.";
    } else if (password.current.value !== passwordConfirm.current.value) {
      passwordConfirm.current.focus();
      document.querySelector(".error_message").innerHTML =
        "비밀번호가 일치하지 않습니다.";
      // console.log(password.current.value);
      // console.log(passwordConfirm.current.value);
    } else {
      document.querySelector(".error_message").innerHTML = "";
      return true;
    }
  };
  // console.log(myEmail);
  // console.log(email);
  // console.log(email.current.value);

  // console.log(myAuthNum);
  // console.log(authNum);
  // console.log(authNumConfirm.current.value);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "1360px",
        margin: "0 auto",
        height: "970px",
        borderRight: "2px solid #dde1e6",
        // position: "center",
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
      <form
        name="file"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        style={{
          width: "560px",
          height: "970px",
          // marginTop: "-24px",
          // marginLeft: "48px",
          // marginTop: "-50px",
        }}
      >
        {/* <StyledImgDiv>
          <div className="image-upload">
            <label htmlFor="file-input">
              <img
                src="https://velog.velcdn.com/images/danchoi/post/fac9c456-b1d5-41fd-b7e0-21a3feb2149f/image.png"
                alt=""
              />
            </label>

            <input id="file-input" type="file" />
          </div>
        </StyledImgDiv>

        <input type="file" name="file" ref={fileRef} /> */}

        <StyledInputDiv>
          <h1
            style={{
              display: "flex",
              color: "#000000",
              marginLeft: "30px",
              fontWeight: "bold",
              fontSize: "34px",
              marginBottom: "20px",
            }}
          >
            {" "}
            회원가입
          </h1>
          <h3
            style={{
              display: "flex",
              color: "#000000",
              opacity: "0.7",
              marginLeft: "30px",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            이미 회원이신가요?
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
            onClick={() => navigate("/login")}
          >
            여기서 로그인하기!
          </h3>
          <span style={{ display: "flex", fontSize: "20px" }}>User Name</span>
          <div>
            <input type="name" ref={userName} placeholder="사원이름 입력하기" />
          </div>
          <span style={{ display: "flex", fontSize: "20px" }}>User number</span>
          <div>
            <input type="text" ref={usernum} placeholder="사원번호 입력하기" />
          </div>
          <span style={{ display: "flex", fontSize: "20px" }}>Email</span>
          <div>
            <div style={{ position: "relative", fontSize: "20px" }}>
              <input
                type="email"
                ref={email}
                value={myEmail}
                onChange={(e) => {
                  setMyEmail(e.target.value);
                }}
                placeholder="이메일 입력하기"
              />

              <button onClick={handleSendCodeClick} style={baseButtonStyle}>
                {sendCodeButtonText}
              </button>
            </div>
          </div>

          <span style={{ display: "flex", fontSize: "20px" }}>
            본인 인증하기
          </span>
          <div style={{ position: "relative", fontSize: "20px" }}>
            <div>
              <input
                type="authNum"
                ref={authNumConfirm}
                // onChange={(e) => {
                //   setMyAuthNum(e.target.value);
                // }}
                placeholder="본인 인증 코드를 입력해주세요"
              />
              <button
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
                  fontSize: "16px",
                  marginTop: "-12px",
                  textAlign: "center",
                }}
              >
                {verificationMessage}
              </div>
            )}
          </div>
          <span style={{ display: "flex", fontSize: "20px" }}>Password</span>
          <div>
            <input
              type="password"
              ref={password}
              placeholder="비밀번호를 입력해주세요"
              value={myPassword}
              onChange={(e) => {
                setMyPassword(e.target.value);
              }}
            />
          </div>
          <span style={{ display: "flex" }}>비밀번호 확인하기</span>
          <div>
            <input
              type="password"
              ref={passwordConfirm}
              placeholder="비밀번호 재입력"
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
        </StyledInputDiv>
        <StyledButtonDiv>
          <StyledInput
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
                //handleSubmit(); 이것 때문에 post요청 중복 된 거임 ㅅㅂ.
              }
            }}
            type="submit"
            value="가입하기"
          />
        </StyledButtonDiv>
      </form>
    </div>
  );
};

const StyledInputDiv = styled.div`
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

export default Signup;
