import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import LoginImg from "../external/loginImg.png";
// import LoginImg from "../../public/loginImg.png";

const Email = () => {
  const imageUrl = process.env.PUBLIC_URL + "/loginImg.png";
  const [usernum, setUsernum] = useState("");
  const [emailInfo, setEmailInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const findEmail = async () => {
    try {
      const response = await axios.get(
        `${MAIN_URL}/employee/email?id=${usernum}`
      );
      setEmailInfo(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("존재하지 않는 사원번호 입니다.");
      } else {
        console.error("Error fetching email:", error);
      }

      // Additional error handling can be added here if needed
    }
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "560px",
          height: "970px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
              marginBottom: "52px",
              cursor: "default",
            }}
          >
            {" "}
            아이디 찾기
          </h1>

          <div>
            <div>
              {!emailInfo ? (
                <>
                  <span
                    style={{
                      display: "flex",
                      fontSize: "20px",
                      fontWeight: "bold",
                      margin: "2px",
                      marginLeft: "30px",
                      color: "#98a2b3",
                      opacity: "0.9",
                      cursor: "default",
                    }}
                  >
                    User Number
                  </span>
                  <input
                    type="text"
                    value={usernum}
                    onChange={(e) => setUsernum(e.target.value)}
                    placeholder="사원 번호 입력하기"
                  />
                  {errorMessage && (
                    <div style={{ color: "red", margin: "-30px 0px 30px 0px" }}>
                      {errorMessage}
                    </div>
                  )}
                  <StyledButtonDiv onClick={findEmail}>
                    아이디 찾기
                  </StyledButtonDiv>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      paddingLeft: "28px",
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#000",
                      marginTop: "52px",
                    }}
                  >
                    {emailInfo.name} <span>님의 이메일은</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      paddingLeft: "28px",
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#175CD3",
                      marginBottom: "52px",
                    }}
                  >
                    {emailInfo.email}
                    <span>입니다.</span>
                  </div>
                  <StyledButtonDiv onClick={() => navigate("/login")}>
                    로그인 하러 가기
                  </StyledButtonDiv>
                </>
              )}
            </div>
          </div>
        </StyledInputDiv>
        {/* <StyledButtonDiv>
          <StyledInput onClick={onEmail()} defaultValue="아이디 찾기" />
        </StyledButtonDiv> */}
      </div>
    </div>
  );
};

const StyledInputDiv = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  color: #aaa;
  margin: 0px 20px;
  padding: 0px 10px 50px 10px;
  width: 460px;

  border-radius: 15px;

  input {
    width: 380px;
    height: 30px;
    margin: 8px 5px;
    margin-left: 2px;
    margin-bottom: 52px;
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
    font-weight: 400;
    margin: 2px;
    margin-left: 6px;
    color: #000;
    opacity: 0.9;
    cursor: default;
  }

  .error_message {
    color: red;
    font-size: 18px;
  }
`;

//현재 로그인 버튼
const StyledButtonDiv = styled.div`
  border-radius: 32px;
  display: flex;
  height: 60px;
  width: 400px;
  font-size: 20px;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  background-color: #175cd3;
  cursor: pointer;
  color: #fff;
  box-shadow: 0.5px 0.5px 12px grey;
  margin: ${(props) => props.margin || "auto"};
`;

export default Email;
