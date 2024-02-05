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
  const add_icon = process.env.PUBLIC_URL + "/folder-add.png";

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

  // 컬럼 0: 'Db분배일'에 대한 유효성 검사 (날짜 검증)
  const isValidDbDate = (dateString) => {
    const cleanString = dateString.toString().replace(/[\.\-\/]/g, "");
    return cleanString.startsWith("202") && cleanString.length === 8;
  };

  // 컬럼 1: '이름'에 대한 유효성 검사 (한글만 허용)
  const isValidName = (name) => {
    return /^[가-힣]+$/.test(name);
  };

  // 컬럼 2: '고객유형'에 대한 유효성 검사 (영어만 허용)
  const isValidCustomerType = (type) => {
    return /^[A-Za-z]+$/.test(type);
  };

  // 컬럼 3: '생년월일'에 대한 유효성 검사 (날짜 검증, "202"로 시작하는 조건 제외)
  const isValidBirthDate = (dateString) => {
    const cleanString = dateString.toString().replace(/[\.\-\/]/g, "");
    return cleanString.length === 8;
  };
  // 컬럼 4: '나이'에 대한 전처리 및 유효성 검사 (숫자만 허용 0~130)
  const isValidAge = (age) => {
    return !isNaN(age) && age >= 0 && age <= 130;
  };

  // 컬럼 5: '연락처'에 대한 전처리 및 유효성 검사
  const formatAndValidateContact = (contact) => {
    // 문자열로 변환하여 trim()과 같은 문자열 메소드를 안전하게 사용
    let contactStr = String(contact);

    // 빈 문자열일 경우 즉시 유효하다고 간주하고 변경하지 않음
    if (contactStr.trim() === "") {
      return { formattedContact: "", isValid: true };
    }

    // 일반적인 구분자와 공백을 제거하여 입력을 정규화
    let normalizedContact = contactStr.replace(/[\.\-\/\s]/g, "");

    // '10'으로 시작하지만 '010'으로 시작하지 않는 번호를 정규화하기 위해 '0'을 앞에 추가
    if (
      normalizedContact.startsWith("10") &&
      !normalizedContact.startsWith("010")
    ) {
      normalizedContact = "0" + normalizedContact;
    }

    // 정규화된 패턴에 일치하는 경우 번호를 포맷
    const formattedContact = normalizedContact.replace(
      /^(010)([0-9]{4})([0-9]{4})$/,
      "$1-$2-$3",
    );

    // 포맷된 번호의 유효성을 검증
    const isValid = /^010-\d{4}-\d{4}$/.test(formattedContact);

    // 포맷된 번호(또는 포맷되지 않은 원본 입력)와 유효성을 모두 반환
    return {
      formattedContact: isValid ? formattedContact : contactStr,
      isValid,
    };
  };

  // 컬럼 6: '주소'에 대한 전처리 및 유효성 검사 (특정 도시명 시군구동읍면리 허용 )
  const isValidResidence = (residence) => {
    // residence 값을 문자열로 강제 변환
    const residenceStr = String(residence);

    const validCities = [
      "서울",
      "부산",
      "대구",
      "인천",
      "광주",
      "대전",
      "울산",
      "세종",
    ];
    const validEndings = ["시", "도", "군", "구", "동", "읍", "면", "리"];

    // 도시 이름을 포함하는지 검사
    const containsValidCity = validCities.some((city) =>
      residenceStr.includes(city),
    );

    // "Province", "County", "Gu", "Dong"으로 끝나는 단어를 포함하는지 검사
    const containsValidEnding = validEndings.some((ending) => {
      const regex = new RegExp(`${ending}\\b`, "g"); // 단어의 끝을 나타내는 정규 표현식
      return regex.test(residenceStr);
    });

    return containsValidCity || containsValidEnding;
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
                        className="my-4 mr-2 h-10 w-[110px] rounded border border-Primary-200 text-Primary-300 hover:bg-Primary-300 hover:text-white"
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
                    <div class="flex">
                      <div
                        // className="file-upload-wrapper"
                        class="h-10 w-[782px] rounded border border-Gray-scale-100 bg-LightMode-Background px-4 py-2"
                      >
                        <label
                          htmlFor="file-upload"
                          // className="file-add-icon"
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
                        <input
                          class="upload-name"
                          value={fileName}
                          style={{ backgroundColor: "white", width: "500px" }}
                          // placeholder="파일첨부하기"
                          disabled
                        />
                      </div>
                      <div class="filebox text-sm">
                        <label for="excelFile">불러오기</label>
                        <input
                          type="file"
                          id="excelFile"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    {/* <div class="filebox text-sm">
                      <label
                        htmlFor="file-upload"
                        className="file-add-icon"
                        style={{ float: "right", cursor: "pointer" }}
                      >
                        <img src={add_icon} />
                      </label>
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
                    </div> */}
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
              <div class="flex pl-10 pr-9">
                <div
                  // className="file-upload-wrapper"
                  class="h-10 w-[782px] rounded border border-Gray-scale-100 bg-LightMode-Background px-4 py-2"
                >
                  <label
                    htmlFor="file-upload"
                    // className="file-add-icon"
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
                  <input
                    class="upload-name"
                    value={fileName}
                    style={{ backgroundColor: "white", width: "500px" }}
                    // placeholder="파일첨부하기"
                    disabled
                  />
                </div>
                <div class="filebox text-sm">
                  <label for="excelFile">불러오기</label>
                  <input
                    type="file"
                    id="excelFile"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div class="mx-9 mt-6">
                <div class="Excel-Item-Title mb-1.5 flex h-8 items-center  text-sm font-light text-white ">
                  <div class="w-[96px]">Db분배일</div>
                  <div class="w-[70px]">이름</div>
                  <div class="w-[70px]">고객유형</div>
                  <div class="w-[70px]">생년월일</div>
                  <div class="w-[50px]">나이</div>
                  <div class="w-[122px]">연락처</div>
                  <div class="w-[142px]">거주지</div>
                  <div class="w-[142px]">특이사항</div>
                  <div class="w-[110px]">인수상태</div>
                </div>
                <div class=" h-[220px] overflow-x-hidden overflow-y-scroll">
                  <tbody class=" w-full  text-[11px]">
                    {/* {excelData.slice(1).map((row, index) => {
                      // J열부터 O열까지 해당하는 인덱스를 제외하고 나머지 데이터만 선택
                      const filteredRow = [
                        ...row.slice(0, 9),
                        ...row.slice(15),
                      ];

                      // Check if the first column's data is valid
                      const isFirstColumnValid = isValidDate(row[0]); */}
                    {excelData.slice(1).map((row, rowIndex) => {
                      return (
                        <tr
                          className="mb-1 flex items-center justify-center text-[10px] font-normal text-LightMode-Text"
                          key={rowIndex}
                        >
                          {Array.from({ length: 9 }).map((_, cellIndex) => {
                            // Ensure 9 columns for each row
                            // Check if data exists for this column, else render empty
                            let cellData =
                              row[cellIndex] !== undefined
                                ? row[cellIndex]
                                : "";

                            // Initial class name based on column index
                            let baseClassName;

                            let isValid = true;
                            let isEmpty = cellData === "";
                            // let displayData = cellData;
                            // 여기서는 className을 설정하는 로직을 필요에 따라 수정해야 할 수 있습니다.
                            switch (cellIndex) {
                              case 0:
                                isValid = isEmpty || isValidDbDate(cellData);
                                baseClassName = "td-db-date";
                                break;
                              case 1:
                                isValid = isEmpty || isValidName(cellData);

                                baseClassName = "td-name";
                                break;
                              case 2:
                                isValid =
                                  isEmpty || isValidCustomerType(cellData);
                                baseClassName = "td-customer-type";
                                break;
                              case 3:
                                isValid = isEmpty || isValidBirthDate(cellData);
                                baseClassName = "td-birth";
                                break;
                              case 4:
                                isValid = isEmpty || isValidAge(cellData);
                                baseClassName = "td-age";
                                break;
                              case 5:
                                const {
                                  formattedContact,
                                  isValid: isContactValid,
                                } = formatAndValidateContact(cellData);
                                cellData = formattedContact; // Use the possibly formatted number
                                isValid = isEmpty || isContactValid; // Use the validation result
                                baseClassName = "td-contact";
                                break;
                              case 6:
                                isValid = isEmpty || isValidResidence(cellData);
                                baseClassName = "td-residence";
                                break;
                              case 7:
                                baseClassName = "td-special-note";
                                break;
                              case 8:
                                baseClassName = "td-state";
                                break;
                              default:
                                baseClassName = "";
                            }
                            // Append 'cell-invalid' class if data is invalid
                            let className = `${baseClassName} ${
                              isEmpty ? "bg-Secondary-50/80" : ""
                            } ${!isValid && !isEmpty ? "cell-invalid" : ""}`;

                            return (
                              <td key={cellIndex} className={className.trim()}>
                                {cellData}
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
