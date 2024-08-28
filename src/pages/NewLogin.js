import React, { useRef, useState } from "react";

const NewLogin = ({ onStart }) => {
  return (
    <div className="relative flex h-[100vh] w-full justify-center">
      {/* <Navbar /> */}
      <div className="login_mobile_img absolute   flex justify-center">
        <div class="relative flex flex-col items-center">
          <div class="relative top-[40px] h-[64px] w-[290px] text-[24px] font-semibold leading-8 text-white">
            고객 관리는 우리가 해줄게요. 영업에만 집중하세요.
          </div>
          <div class="flex justify-center">
            <div class="relative top-[50px] mt-2 h-[44px] w-[180px]  text-[14px] font-medium leading-5 text-[#EBF1FF]">
              INSUREPRO는 보험 설계사의 고객 관리를 서포팅해줍니다.
            </div>
          </div>
          <div
            class="relative top-[460px] flex h-[42px] w-[330px] cursor-pointer items-center justify-center rounded bg-white text-base font-semibold text-Primary-300 shadow-[0_0_16px_0_rgba(0,0,0,0.25)] hover:bg-Primary-300 hover:text-white"
            onClick={onStart}
          >
            INSUREPRO 이용하기
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;
