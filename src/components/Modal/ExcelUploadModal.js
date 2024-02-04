import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import "../../App.css";
import * as XLSX from "xlsx";

const ExcelUploadModal = ({ show, onHide }) => {
  const [showModal, setShowModal] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [file, setFile] = useState(null);
  const [isNextClicked, setIsNextClicked] = useState(false); // New state for tracking 'Next' button click

  const close_icon = process.env.PUBLIC_URL + "/Close.png";

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [fileName, setFileName] = useState(""); // input에 파일명 표시를 위한 변수

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      setFileName(file.name); // Update the file name state
    } else {
      setFileName(""); // Reset file name if no file is selected
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setExcelData(data);
    };
    reader.readAsBinaryString(file);
    // Update the displayed file name
    // const fileName = e.target.value.split("\\").pop();
    const fileName = file.name; // 파일 객체에서 직접 파일 이름을 가져옵니다.
    document.querySelector(".upload-name").value = fileName; // 업로드된 파일 이름으로 업데이트
  };
  const handleNextClick = () => {
    setIsNextClicked(true); // Set state when 'Next' is clicked
  };
  const handleprevClick = () => {
    setIsNextClicked(false); // Set state when 'Next' is clicked
  };

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;
  const formatCustomerData = (rowData) => {
    // Mapping Excel data to API format
    // 각 필드에 대해 값이 undefined, null, 또는 빈 문자열인 경우 ""로 대체
    return {
      registerDate: rowData[0] || "",
      name: rowData[1] || "",
      customerType: rowData[2] || "",
      birth: rowData[3] || "",
      age: rowData[4] || "",
      phone: rowData[5] || "",
      dongString: rowData[6] || "", // 이미 잘 처리되고 있는 것으로 가정
      memo: rowData[7] || "",
      state: rowData[8] || "",
    };
  };
  const handleSubmit = async () => {
    const customerData = excelData.slice(1).map(formatCustomerData); // Skip the header row

    try {
      const response = await fetch(`${MAIN_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(customerData),
      });

      if (response.status === 201) {
        console.log("Customers added successfully");
        onHide(); // Close the modal after successful submission
        // Handle success
      } else {
        console.error("Failed to add customers");
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  // 엑셀 템플릿 다운로드 버튼을 처리하는 함수
  const handleDownloadTemplate = () => {
    // 가정: 엑셀 파일의 URL이 "/templates/excel_template.xlsx"에 위치한다고 가정
    window.location.href = process.env.PUBLIC_URL + "/insurepro_엑셀등록.xlsx";
  };

  return (
    <>
      <div>
        {!isNextClicked && (
          <>
            <Modal className="excelupload-modal-style  " show={show}>
              <div class="h-8 rounded-t-md  bg-LightMode-SectionBackground px-7 py-[7px] text-sm font-normal">
                <div class="flex justify-between ">
                  <div>엑셀파일로 고객 추가</div>
                  <img
                    class="cursor-pointer"
                    onClick={onHide}
                    src={close_icon}
                  />
                </div>
              </div>
              <div class="px-9 text-sm">
                <div>
                  <div class="flex flex-col   ">
                    {/* 엑셀 템플릿 다운로드 버튼 추가 */}
                    <div class="flex justify-end">
                      <button
                        onClick={handleDownloadTemplate}
                        className="my-4 h-10  w-[120px] border text-Primary-300"
                      >
                        양식 다운받기
                      </button>
                    </div>
                    {/* <div class=" mt-3  flex h-[42px] items-center border bg-gray-300 pl-4 text-white">
                      엑셀 파일 추가시 가이드라인
                    </div> */}
                    {/* <div class="mb-2 flex h-[85px] items-center justify-center border">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do
                    </div> */}
                    {/* <div class="h-[46px] w-[632px] border"> */}
                    <div class="filebox text-sm">
                      <input
                        class="upload-name"
                        value={fileName}
                        // placeholder="파일첨부하기"
                        disabled
                      />
                      <label for="excelFile">불러오기</label>
                      <input
                        type="file"
                        id="excelFile"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
                <div class="mt-10 flex justify-center">
                  <button
                    class={`h-10 w-[916px] rounded border text-[17px] ${
                      file ? "bg-primary-100 text-white" : "text-gray-300"
                    }`}
                    onClick={handleNextClick}
                  >
                    불러오기
                  </button>
                </div>
              </div>
            </Modal>
          </>
        )}
        {isNextClicked && (
          <>
            <Modal className="excelupload-modal-style2  " show={show}>
              <div class="mb-6 h-8 rounded-t-md  bg-LightMode-SectionBackground px-7 py-[7px] text-sm font-normal">
                <div class="flex justify-between ">
                  <div class="cursor-default">엑셀파일로 고객 추가</div>
                  <img
                    class="cursor-pointer"
                    onClick={onHide}
                    src={close_icon}
                  />
                </div>
              </div>
              <div class="filebox ml-3 text-sm">
                <input
                  class="upload-name mr-[34px]"
                  value={fileName}
                  disabled
                />
                <label for="excelFile">불러오기</label>
                <input type="file" id="excelFile" onChange={handleFileChange} />
              </div>
              <div class="mx-3 mt-6">
                <div class="Excel-Item-Title mb-1.5 flex h-8 items-center  text-sm font-light text-white ">
                  <div class="w-[96px]">Db분배일</div>
                  <div class="w-[70px]">이름</div>
                  <div class="w-[70px]">고객유형</div>
                  <div class="w-[70px]">생년월일</div>
                  <div class="w-[50px]">나이</div>
                  <div class="w-[122px]">연락처</div>
                  <div class="w-[142px]">거주지</div>
                  <div class="w-[110px]">특이사항</div>
                  <div class="w-[110px]">인수상태</div>
                </div>
                <div class=" h-[220px] overflow-auto">
                  <tbody class=" w-full  text-[11px]">
                    {excelData.slice(1).map((row, index) => {
                      // J열부터 O열까지 해당하는 인덱스를 제외하고 나머지 데이터만 선택
                      const filteredRow = [
                        ...row.slice(0, 9),
                        ...row.slice(15),
                      ];

                      return (
                        <tr
                          className="mb-1 flex items-center justify-center text-[10px] font-normal text-LightMode-Text"
                          key={index}
                        >
                          {filteredRow.map((cell, cellIndex) => {
                            let className;
                            // 여기서는 className을 설정하는 로직을 필요에 따라 수정해야 할 수 있습니다.
                            switch (cellIndex) {
                              case 0:
                                className = "td-db-date";
                                break;
                              case 1:
                                className = "td-name";
                                break;
                              case 2:
                                className = "td-customer-type";
                                break;
                              case 3:
                                className = "td-birth";
                                break;
                              case 4:
                                className = "td-age";
                                break;
                              case 5:
                                className = "td-contact";
                                break;
                              case 6:
                                className = "td-residence";
                                break;
                              case 7:
                                className = "td-special-note";
                                break;
                              case 8:
                                className = "td-state";
                                break;
                              default:
                                className = "";
                            }
                            return (
                              <td key={cellIndex} className={className}>
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </div>
              </div>
              <div class="mt-10 flex w-full flex-col text-center">
                <div>파일의 내용이 알맞게 삽입되었는지 확인해보세요.</div>
                <div>
                  엑셀 등록 이후, 잘못된 정보는 개별 삭제만 가능하오니
                  유의바랍니다.
                </div>
              </div>
              <div class="mt-10 flex w-full justify-center">
                <button
                  class="text-Gray mr-3 h-10 w-[310px] border text-Gray-scale-50 hover:bg-Primary-300 hover:text-white"
                  onClick={handleprevClick}
                >
                  이전
                </button>
                <button
                  class="h-10 w-[310px] border bg-Primary-300 text-white"
                  onClick={handleSubmit}
                >
                  저장
                </button>
              </div>
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default ExcelUploadModal;
