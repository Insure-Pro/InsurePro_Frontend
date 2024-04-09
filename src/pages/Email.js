import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Main/Navbar/Navbar";

const Email = () => {
  const [usernum, setUsernum] = useState("");
  const [emailInfo, setEmailInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const findEmail = async () => {
    try {
      const response = await axios.get(
        `${MAIN_URL}/employee/email?id=${usernum}`,
      );
      setEmailInfo(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("존재하지 않는 사원번호 입니다.");
      } else {
        console.error("Error fetching email:", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <div class="flex h-screen w-screen flex-col  bg-LightMode-SectionBackground pt-[76px]">
          <div class="mb-[68px] mt-[57px] flex justify-center text-[17px] font-semibold text-LightMode-Text">
            {" "}
            아이디 찾기
          </div>
          <div class="flex w-full  justify-center">
            <hr className="signin_hr0 " />
          </div>
          <div class="flex justify-center">
            <div class="flex w-[623px] flex-col  ">
              {!emailInfo ? (
                <>
                  <div class="mb-4 mt-7 flex">
                    <span className="signin_span">
                      <span className="Highlighting">*</span>
                      이름
                    </span>
                    <input
                      // type="password"
                      // ref={passwordConfirm}
                      placeholder="이름을 입력해주세요"
                      className="signin_input_box"
                    />
                  </div>
                  <div class="mb-12 flex">
                    <span className="signin_span">
                      <span className="Highlighting">*</span>사원번호
                    </span>
                    <input
                      type="text"
                      value={usernum}
                      className="signin_input_box"
                      onChange={(e) => setUsernum(e.target.value)}
                      placeholder="사원번호를 입력해주세요"
                    />
                  </div>
                  {errorMessage && (
                    <div style={{ color: "red", margin: "-30px 0px 30px 0px" }}>
                      {errorMessage}
                    </div>
                  )}
                  <div class="flex w-full justify-center">
                    <div
                      class="flex h-[42px] w-[280px] cursor-pointer items-center justify-center rounded border border-LightMode-Subtext bg-Primary-400  text-base font-semibold text-white"
                      onClick={findEmail}
                    >
                      아이디 찾기
                    </div>
                  </div>{" "}
                </>
              ) : (
                <>
                  <div class="my-[76px] text-base font-light text-LightMode-Subtext">
                    {emailInfo.name} <span>님의 아이디는 </span>
                    <span class="text-base font-extrabold text-LightMode-Text">
                      {emailInfo.email}
                    </span>
                    <span> 입니다.</span>
                  </div>
                  <div class="flex w-full justify-center">
                    <div
                      class="flex h-[42px] w-[280px] cursor-pointer items-center justify-center rounded border border-LightMode-Subtext bg-Primary-400  text-base font-semibold text-white"
                      onClick={() => navigate("/login")}
                    >
                      로그인 하러 가기
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
