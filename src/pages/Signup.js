import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/buttons/Button";

const Signup = () => {
  const fileRef = useRef("");
  const email = useRef("");
  const usernum = useRef("");
  const authNum = useRef("");
  const authNumConfirm = useRef("");
  const password = useRef("");
  const passwordConfirm = useRef("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    // const formData = new FormData();
    const data = {
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
        .post("http://52.79.81.200:8080/v1/employee/signin/", {
          email: email.current.value,
          id: usernum.current.value,
          password: password.current.value,
          rePassword: passwordConfirm.current.value,
          // companyPk: 2,//
          authNum: parseInt(authNumConfirm.current.value),
        })
        .then((response) => {
          console.log(response);
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
          console.log({ data });
        });
    }
  };

  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
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
      console.log(password.current.value);
      console.log(passwordConfirm.current.value);
    } else {
      return true;
    }
  };
  // console.log(myEmail);
  // console.log(email);
  // console.log(email.current.value);

  console.log(myAuthNum);
  console.log(authNum);
  console.log(authNumConfirm.current.value);
  return (
    <div>
      <form name="file" encType="multipart/form-data" onSubmit={handleSubmit}>
        <StyledImgDiv>
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

        <input type="file" name="file" ref={fileRef} />

        <StyledInputDiv>
          <span>User number</span>
          <div>
            <input type="text" ref={usernum} placeholder="사원번호 입력하기" />
            <div>
              <span>Email</span>
            </div>
            <input
              type="email"
              ref={email}
              value={myEmail}
              onChange={(e) => {
                setMyEmail(e.target.value);
              }}
              placeholder="이메일 입력하기"
            />

            <button
              onClick={() => {
                axios
                  .post("http://52.79.81.200:8080/v1/email", {
                    email: myEmail,
                  })
                  .then((결과) => {
                    setMyAuthNum(결과.data.authNum);
                    //추후 수정할 떄 authNum비교 오류 여기서 usestatet
                    //사용하지 말고, authNum 변수에 바로 할당하고 if문 돌려보기
                  });
              }}
            >
              코드전송
            </button>
          </div>
          <span>본인 인증하기</span>
          <div>
            <input
              type="authNum"
              ref={authNumConfirm}
              // onChange={(e) => {
              //   setMyAuthNum(e.target.value);
              // }}
              placeholder="본인 인증 코드를 입력해주세요"
            />
            <button>재전송</button>
          </div>

          <span>Password</span>
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
          <span>비밀번호 확인하기</span>
          <div>
            <input
              type="password"
              ref={passwordConfirm}
              placeholder="비밀번호 재입력"
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
                //handleSubmit(); 이것 때문에 post요청 중복 된 거임 ㅅㅂ.
              }
            }}
            type="submit"
            value="가입하기"
          />
          <Button onClick={() => navigate("/login")}>돌아가기</Button>
        </StyledButtonDiv>
      </form>
    </div>
  );
};

const StyledImgDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
  .image-upload > input {
    display: none;
  }
`;

const StyledInputDiv = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  color: #aaa;
  margin: 2vh auto 20px;
  padding: 20px 10px;
  width: 80vw;
  box-shadow: 1px 1px 15px grey;
  border-radius: 15px;
  input {
    width: 50vw;
    height: 30px;
    margin: 15px 0;
    font-size: 16px;
    outline: none;
    border: none;
    border-bottom: 1px solid #ddd;
  }
  span {
    font-family: "Do Hyeon", sans-serif;
    font-size: 16px;
    margin: 10px;
    color: #555;
  }
  .error_message {
    color: red;
    font-size: 18px;
  }
`;

const StyledInput = styled.input`
  font-size: 25px;
  font-family: "Do Hyeon", sans-serif;
  width: 35vw;
  height: 40px;
  border: none;
  background-color: transparent;
  margin: 10px;
  color: #555;
  cursor: pointer;
`;

const StyledButtonDiv = styled.div`
  display: flex;
  width: 75vw;
  margin: ${(props) => props.margin || "auto"};
`;

export default Signup;
