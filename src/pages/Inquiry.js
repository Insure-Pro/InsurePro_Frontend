import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../components/Main/Navbar/Navbar";
import { useLocation } from "react-router-dom";
import { FormCheck } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import Swal from "sweetalert2";

const Inquiry = ({}) => {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  const location = useLocation();

  const isMobile = useMediaQuery({ query: "(max-width:822px)" });

  const add_icon = process.env.PUBLIC_URL + "/folder-add.png";

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log("Submit button clicked"); // 버튼 클릭 확인

    // FormData 인스턴스 생성
    const formData = new FormData();
    // 'content' 키에 텍스트 내용 추가
    formData.append("content", content);
    // 선택적으로 파일 추가 ('file'은 input 태그의 id와 동일해야 함)
    if (selectedFile) formData.append("image", selectedFile);

    // JSON 형식의 데이터를 보내기 위해 axios 요청을 수정합니다.
    // const data = JSON.stringify({ content: content.current.value });
    try {
      const response = await axios.post(`${MAIN_URL}/questions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 201) {
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
        setSelectedFile(""); // 파일선택 초기화
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div class="">
      <Navbar />
      {isMobile ? (
        <div
          class=" w-full bg-LightMode-SectionBackground"
          style={{
            userSelect: "none",
          }}
        >
          <div class="flex h-[86px] w-full items-center bg-Primary-400/50  px-5 py-4 text-sm font-normal text-white">
            <div class="mx-auto flex flex-col items-center">
              {" "}
              <div class="flex">
                <div class=" mb-0.5 flex  xsm:w-[360px] sm:w-[520px]">
                  안녕하세요{" "}
                  <span class="ml-1.5 mr-0.5">
                    <b> INSUREPRO CS TEAM </b>
                  </span>
                  입니다.
                </div>
              </div>
              <div class="flex">
                <div class=" mb-0.5 flex  xsm:w-[360px] sm:w-[520px]">
                  보다 나은 서비스를 제공하기 위해 여러분들의 불편사항
                </div>
              </div>
              <div class="flex">
                <div class=" mb-0.5 flex  xsm:w-[360px] sm:w-[520px]">
                  및 문의사항을 접수 받고 있습니다.
                </div>
              </div>
            </div>
          </div>

          <div class="flex h-[600px] flex-col items-center bg-white pt-5 align-top  text-sm">
            <div class="mb-5">
              <div class="mb-2 flex">
                <span class=" w-[78px] pl-1.5 text-left">내용 (필수)</span>
              </div>
              <textarea
                class=" h-[186px] justify-start rounded  border border-Gray-scale-100 p-4 pb-2 align-top xsm:w-[342px] sm:w-[502px] "
                value={content}
                onChange={(e) => setContent(e.target.value)} // 입력 값 상태 업데이트
                rows={10}
              ></textarea>
            </div>
            <div class="mb-10">
              <div class="flex">
                <span class="w-[78px] text-left">파일첨부</span>
              </div>
              <div
                className="file-upload-wrapper"
                class="h-10 rounded border border-Gray-scale-100 bg-LightMode-Background px-4 py-2 xsm:w-[340px] sm:w-[500px]"
              >
                <label
                  htmlFor="file-upload"
                  className="file-add-icon"
                  style={{ float: "right", cursor: "pointer" }}
                >
                  <img src={add_icon} />
                </label>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <span className="file-name" style={{ float: "left" }}>
                  {selectedFile ? selectedFile.name : ""}
                </span>
              </div>
            </div>
            <div class=" ml-3 flex h-[50px] xsm:w-[340px] sm:w-[500px]">
              <div class="mb-1  mt-[24px] flex">
                <FormCheck />
                <span class="ml-2 text-xs font-light">
                  개인정보 수집 및 이용 동의(필수)
                </span>
              </div>
            </div>
            <div class=" mb-5 flex h-[48px] rounded bg-[#E4E7EC] p-2  text-left  text-xs font-light  text-[#98A2B3] xsm:w-[340px] sm:w-[500px]">
              문의 처리를 위해 이메일, 회원정보, 문의내용에 포함된 개인정보를
              수집하며, 개인정보처리방침에 따라 3년 후 파기됩니다.
            </div>

            <div class="flex w-full justify-center">
              <button
                onClick={handleSubmit}
                class="flex h-[40px] items-center justify-center rounded border border-primary-100  py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white xsm:w-[340px] sm:w-[500px]"
              >
                접수
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          class=" w-full min-w-[1024px] bg-LightMode-SectionBackground"
          style={{
            userSelect: "none",
          }}
        >
          <div class="h-[86px]  bg-white  px-12 py-4 text-sm font-normal">
            <div class="flex flex-col items-center">
              {" "}
              <div class="flex">
                <div class=" mb-2.5 flex w-[470px]">
                  안녕하세요 INSUREPRO CS TEAM입니다.
                </div>
                <div class=" w-[450px]"></div>
              </div>
              <div class="flex">
                <div class="flex w-[500px]">
                  보다 나은 서비스를 제공하기 위해 여러분들의 불편사항 및 문의
                  사항을 접수 받고 있습니다.
                </div>
                <div class="w-[420px]"></div>
              </div>
            </div>
          </div>

          <div class="flex h-[558px] flex-col items-center bg-LightMode-SectionBackground pt-10 align-top  text-sm">
            <div class="mb-10 flex">
              <div class="flex  flex-col">
                <span class="mr-[47px] w-[60px] pl-1.5 text-left">내용</span>
                <span class=" mr-[47px] w-[60px] pl-0.5 text-left">(필수)</span>
              </div>
              <textarea
                class=" h-[186px] w-[782px]  justify-start rounded border border-Gray-scale-100 p-4 pb-2 align-top "
                value={content}
                onChange={(e) => setContent(e.target.value)} // 입력 값 상태 업데이트
                rows={10}
              ></textarea>
            </div>
            <div class="flex items-center">
              <span class="mr-[47px] w-[60px]">파일첨부</span>
              <div
                className="file-upload-wrapper"
                class="h-10 w-[782px] rounded border border-Gray-scale-100 bg-LightMode-Background px-4 py-2"
              >
                <label
                  htmlFor="file-upload"
                  className="file-add-icon"
                  style={{ float: "right", cursor: "pointer" }}
                >
                  <img src={add_icon} />
                </label>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <span className="file-name" style={{ float: "left" }}>
                  {selectedFile ? selectedFile.name : ""}
                </span>
              </div>
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
                class="flex h-[40px] w-[280px] items-center justify-center rounded  border border-primary-100 py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white"
              >
                접수
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Inquiry;
