import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FormCheck } from "react-bootstrap";
import Swal from "sweetalert2";

const Inquiry = ({}) => {
  // const content = useRef("");
  const [content, setContent] = useState("");
  const location = useLocation();

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(
    2,
    "0",
  )}`; // formattedDate 업데이트

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log("Submit button clicked"); // 버튼 클릭 확인
    // JSON 형식의 데이터를 보내기 위해 axios 요청을 수정합니다.
    // const data = JSON.stringify({ content: content.current.value });
    try {
      const response = await axios.post(
        `${MAIN_URL}/questions`,
        {
          content,
        },
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (response.status === 201) {
        // alert(
        //   "감사합니다.\n" +
        //     "고객님의 의견을 INSURPRO CS TEAM 담당자에게 전달하였습니다.\n" +
        //     "빠른 시일 내로 해당 부분을 검토 후, 시스템에 적용하겠습니다.\n" +
        //     "항상 INSUREPRO를 이용해주시는 고객님께 감사의 인사 전합니다.",
        // );
        Swal.fire({
          html:
            "<div style='text-align: left; font-size:16px;'>" +
            "감사합니다.<br><br>" +
            "고객님의 의견을 INSURPRO CS TEAM 담당자에게 전달하였습니다.<br><br><br>" +
            "빠른 시일 내로 해당 부분을 검토 후,<br>" +
            "시스템에 적용하겠습니다.<br><br><br>" +
            "항상 INSUREPRO를 이용해주시는 고객님께 감사의 인사 전합니다." +
            "</div>",
          // width: "700px",
          timer: 4000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setContent(""); // 폼 초기화
      }
    } catch (error) {
      console.error("Inquiry submit error:", error);
      Swal.fire({
        text: "문의 접수 중 오류가 발생했습니다: " + error,
        timer: 4000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  const handleMonthCustomersClick = () => {
    navigate("/main", { state: { selectedTab: "월별 고객", formattedDate } });
  };

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
        onMonthCustomersClick={handleMonthCustomersClick}
        ContractedCustomerClcik={handleContractCompleteClick}
        AllCustomersClick={handleAllCustomersClick}
        resetSearch={() => {}} //메인컴포넌트 이외에는 그냥 에러만 발생하지 않도록 빈값 전달
      />
      <div
        class=" mx-auto h-screen w-full min-w-[1024px] bg-LightMode-SectionBackground pt-[72px]"
        style={{
          userSelect: "none",
        }}
      >
        <div class="h-[86px] bg-white px-12  py-4 text-start font-normal">
          {" "}
          <div class="mb-2">안녕하세요 INSUREPRO CS TEAM입니다.</div>
          <div>
            보다 나은 서비스를 제공하기 위해 여러분들의 불편사항 및 문의 사항을
            접수 받고 있습니다.
          </div>
        </div>

        <div class="flex h-[558px] flex-col items-start bg-LightMode-SectionBackground pl-[75px] pt-10 align-top  text-sm">
          <div class="mb-10 ">
            <span class="mr-[82px]">내용</span>
            <input
              class=" h-[186px] w-[782px]  p-4 pb-2   align-text-top"
              type="text"
              // ref={content}
              value={content}
              onChange={(e) => setContent(e.target.value)} // 입력 값 상태 업데이트
              as="textarea"
              rows={10}
            ></input>
          </div>
          <div class="flex items-center">
            <span class="mr-[58px]">파일첨부</span>

            <label htmlFor="file">
              <div class="btn-upload ">파일 업로드하기</div>
            </label>
            <input type="file" name="file" id="file"></input>
          </div>
          <div class="mb-1 mt-[88px] flex">
            <FormCheck />
            <span class="ml-2 text-xs font-light">
              개인정보 수집 및 이용 동의(필수)
            </span>
          </div>
          <div class=" mb-5 flex h-9 w-[890px] items-center  bg-[#E4E7EC]  pl-4  text-xs font-light text-[#98A2B3]">
            문의 처리를 위해 이메일, 회원정보, 문의내용에 포함된 개인정보를
            수집하며, 개인정보처리방침에 따라 3년 후 파기됩니다.
          </div>
          <div class="flex w-full justify-center">
            <button
              onClick={handleSubmit}
              // type="submit"
              class="flex h-[40px] w-[280px] items-center justify-center  border border-primary-100 py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white"
            >
              접수
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Inquiry;
