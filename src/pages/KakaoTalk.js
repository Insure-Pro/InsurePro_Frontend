import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import KakaoLogin from "../components/KakaoLogin";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const KakaoTalk = ({}) => {
  const navigate = useNavigate();

  const KakaoLogin_img =
    process.env.PUBLIC_URL + "/kakao_login_medium_wide.png";

  const handleAllCustomersClick = () => {
    navigate("/main", { state: { selectedTab: "전체" } });
  };

  const handleContractCompleteClick = () => {
    navigate("/main", { state: { selectedTab: "계약완료고객" } });
  };

  return (
    <div>
      <Navbar
        onContractCompleteClick={handleContractCompleteClick}
        onAllCustomersClick={handleAllCustomersClick}
        onMonthCustomersClick={() => {}}
        ContractedCustomerClcik={handleContractCompleteClick}
        AllCustomersClick={handleAllCustomersClick}
        resetSearch={() => {}}
      />
      <div class="h-screen w-full bg-LightMode-SectionBackground pt-[76px]">
        <div class="flex h-full flex-row items-center justify-center">
          <div class="flex flex-col">
            {/* <KakaoLogin /> */}
            <img src={KakaoLogin_img} />
            <div class="my-[20px] flex w-[350px] text-left text-base ">
              발송 고객 리스트
            </div>
            <div class="mb-[80px] h-[420px] w-[350px] bg-white">
              <div class="flex h-10 w-[350px] items-center bg-Secondary-300">
                <div class="m-10 font-semibold text-white">고객명</div>
                <div class="ml-4 font-semibold text-white">호칭</div>
                <div class="ml-[80px] font-semibold text-white">선택여부</div>
              </div>
              <div class="flex h-10 w-[442px] items-center  ">
                <div class="m-10 font-semibold text-black">신우경</div>
                <div class="ml-4 font-semibold text-black">우경</div>
                <input class="ml-[100px]" type="checkbox"></input>
              </div>
              <hr />
              <div class="flex h-10 w-[442px] items-center  ">
                <div class="m-10 font-semibold text-black">이현지</div>
                <div class="ml-4 font-semibold text-black">현지</div>
                <input class="ml-[100px]" type="checkbox"></input>
              </div>
              <hr />
            </div>
          </div>
          <div class="ml-10">
            <div class="mb-[20px] mt-[40px] flex h-[40px] w-[440px] items-center justify-center  bg-Secondary-300 font-semibold text-white">
              보낼 내용 입력
            </div>
            {/* <div class="h-[280px] w-[440px] bg-white"> */}
            <input type="text" class="h-[280px] w-[440px] bg-white"></input>
            {/* </div> */}
            <button class="mt-10  flex h-[40px] w-[440px] items-center justify-center rounded-md bg-[#FEE500] py-2 font-semibold ">
              고객에게 발송
            </button>
          </div>
          {/* <img src={KakaoLogin_img} class="cursor-pointer" /> */}
        </div>
      </div>
    </div>
  );
};

export default KakaoTalk;
