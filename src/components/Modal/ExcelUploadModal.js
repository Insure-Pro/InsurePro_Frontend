import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "../../App.css";
import * as XLSX from "xlsx";

const ExcelUploadModal = ({ show, onHide }) => {
  const [showModal, setShowModal] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [file, setFile] = useState(null);
  const [isNextClicked, setIsNextClicked] = useState(false); // New state for tracking 'Next' button click

  const [isEditMode, setIsEditMode] = useState(false);
  const [modifiedCells, setModifiedCells] = useState([]);

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const add_icon = process.env.PUBLIC_URL + "/folder-add.png";

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [fileName, setFileName] = useState(""); // input에 파일명 표시를 위한 변수

  const handleFileChange = (e) => {
    // Reset the modified cells and any potential error states
    setModifiedCells([]);
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
    const fileName = file.name; // 파일 객체에서 직접 파일 이름을 가져옵니다.
    document.querySelector(".upload-name").value = fileName; // 업로드된 파일 이름으로 업데이트
  };

  const handleNextClick = () => {
    setIsNextClicked(true); // Set state when 'Next' is clicked
  };
  const handleprevClick = () => {
    setIsNextClicked(false); // Set state when 'Next' is clicked
  };

  // isRowNotEmpty 함수를 컴포넌트 바깥쪽 혹은 렌더링 로직 전에 정의합니다.
  const isRowNotEmpty = (row) => row.some((cell) => cell);

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;
  const formatCustomerData = (rowData) => {
    const phoneData = formatAndValidateContact(rowData[5]); // 연락처 전처리

    // Mapping Excel data to API format
    // 각 필드에 대해 값이 undefined, null, 또는 빈 문자열인 경우 ""로 대체
    return {
      registerDate: rowData[0] ? formatDate(rowData[0].toString().trim()) : "",
      name:
        rowData[1] && typeof rowData[1] === "string" ? rowData[1].trim() : "",
      customerType:
        rowData[2] && typeof rowData[2] === "string" ? rowData[2].trim() : "",
      birth: rowData[3] ? formatDate(rowData[3].toString().trim()) : "",
      age: rowData[4] ? rowData[4].toString().trim() : "", // 나이는 숫자일 수 있음, 문자열로 변환 후 처리
      phone: phoneData.formattedContact, // 전처리된 연락처 데이터 사용
      dongString:
        rowData[6] && typeof rowData[6] === "string" ? rowData[6].trim() : "",
      memo:
        rowData[7] && typeof rowData[7] === "string" ? rowData[7].trim() : "",
      state:
        rowData[8] && typeof rowData[8] === "string" ? rowData[8].trim() : "",
    };
  };
  const handleSubmit = async () => {
    // 전처리 및 유효성 검사를 통과한 데이터만 필터링
    // 기존 데이터의 복사본을 만듭니다.
    console.log("Original Excel Data:", excelData);
    console.log("Modifications to Apply:", modifiedCells);

    const updatedExcelData = excelData.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const modification = modifiedCells.find(
          (mc) => mc.rowIndex === rowIndex - 1 && mc.cellIndex === cellIndex,
        );
        return modification ? modification.newValue : cell;
      }),
    );
    console.log("Updated Excel Data for Submission: ", updatedExcelData);
    // 변경된 셀에 대해서만 데이터를 업데이트합니다.
    // modifiedCells.forEach(({ rowIndex, cellIndex, newValue }) => {
    //   if (updatedExcelData[rowIndex]) {
    //     updatedExcelData[rowIndex][cellIndex] = newValue;
    //   }
    // });

    // Format the updated data for submission
    const formattedDataForSubmission = updatedExcelData
      .slice(1) // 헤더 제외
      .map((row) => formatCustomerData(row)) // 각 행에 대한 데이터 포매팅
      .filter((rowData) =>
        Object.values(rowData).some((value) => value !== ""),
      ); // 유효한 데이터만 필터링
    console.log("Formatted Data for Submission: ", formattedDataForSubmission);
    // Filter out rows where all the fields are empty
    // const validDataForSubmission = formattedDataForSubmission.filter(
    //   (rowData) => Object.values(rowData).some((value) => value !== ""),
    // );
    // 변경된 내용이 없는 경우 함수를 종료합니다.
    // if (filteredAndFormattedData.length === 0) {
    //   console.error("No valid data to submit");
    //   return;
    // }
    try {
      const response = await fetch(`${MAIN_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formattedDataForSubmission),
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
    // 수정 사항을 초기화합니다.
    setModifiedCells([]);
  };

  // 엑셀 템플릿 다운로드 버튼을 처리하는 함수
  const handleDownloadTemplate = () => {
    // 가정: 엑셀 파일의 URL이 "/templates/excel_template.xlsx"에 위치한다고 가정
    window.location.href = process.env.PUBLIC_URL + "/insurepro_엑셀등록.xlsx";
  };

  // 컬럼 0: 'Db분배일'에 대한 유효성 검사 (날짜 검증)
  // 날짜 데이터를 'YYYY-MM-DD' 형식으로 변환하는 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return ""; // dateStr이 undefined, null, 또는 빈 문자열일 경우 빈 문자열 반환

    // 문자열로 강제 변환하기 전에 dateStr이 문자열인지 확인
    if (typeof dateStr !== "string") {
      console.error("dateStr must be a string");
      return ""; // 문자열이 아닌 경우 빈 문자열 반환
    }
    // 모든 비숫자 제거 후 YYYYMMDD 형식으로 예상
    const cleanDateStr = dateStr.replace(/\D/g, "");

    // Expecting 'YYYYMMDD' after cleanup
    if (cleanDateStr.length === 8) {
      return `${cleanDateStr.slice(0, 4)}-${cleanDateStr.slice(
        4,
        6,
      )}-${cleanDateStr.slice(6, 8)}`;
    }
    // 다른 형식 처리 또는 비표준 입력에 대해 원본 문자열 반환
    return dateStr;
  };
  // Validate the date format to be 'YYYY-MM-DD'
  const isValidDbDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(formatDate(dateStr));
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
    // 입력 값이 undefined이거나 null인 경우, 즉시 빈 문자열로 처리
    if (contact == null) return { formattedContact: "", isValid: false };

    // 문자열로 변환하여 trim()과 같은 문자열 메소드를 안전하게 사용
    let contactStr = String(contact).trim();

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
      "양산",
      "경남",
      "경북",
    ];
    const validEndings = [
      "시",
      "도",
      "군",
      "구",
      "동",
      "읍",
      "면",
      "리",
      "로",
      "대로",
      "길",
    ];

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

  const [invalidCounts, setInvalidCounts] = useState(Array(7).fill(0)); // 9개 컬럼에 대한 유효하지 않은 값의 개수 초기화
  const totalInvalidCounts = invalidCounts.reduce((acc, curr) => acc + curr, 0);
  useEffect(() => {
    const newInvalidCounts = excelData
      .slice(1) // Assuming first row is headers
      .reduce((acc, row) => {
        row.forEach((cell, index) => {
          if (index >= 7) return; // 7개 컬럼만 유효성 검사를 수행
          // Apply each validation function based on the column index
          let isValid;
          let isEmpty = cell.toString().trim() === ""; // 공백만 있는 경우도 빈 값으로 처리
          let isMandatory = false; // 필수 항목인지 여부를 결정하는 플래그

          switch (index) {
            case 0:
              const transformedDate = formatDate(cell.toString());
              cell = transformedDate;
              isValid = isEmpty || isValidDbDate(transformedDate);
              break;
            case 1:
              isValid = isValidName(cell);
              isMandatory = true; // 이름은 필수 항목
              break;
            case 2:
              isValid = isEmpty || isValidCustomerType(cell);

              break;
            case 3:
              isValid = isEmpty || isValidBirthDate(cell);

              break;
            case 4:
              isValid = isEmpty || isValidAge(cell);

              break;
            case 5:
              const { formattedContact, isValid: isContactValid } =
                formatAndValidateContact(cell);
              cell = formattedContact; // Use the possibly formatted number
              isValid = isContactValid; // Use the validation result
              isMandatory = true; // 연락처는 필수 항목
              break;
            case 6:
              isValid = isEmpty || isValidResidence(cell);
              break;
            // Include other cases for each column's validation
          }
          // 필수 항목이면서 값이 비어 있을 경우, 유효하지 않음
          if (isMandatory && isEmpty) {
            isValid = false;
          }

          if (!isValid) acc[index]++;
        });
        return acc;
      }, Array(7).fill(0)); // 7개 컬럼에 대한 유효하지 않은 값의 개수 초기화

    setInvalidCounts(newInvalidCounts.filter((n) => !isNaN(n))); // NaN 값을 제외하고 상태 업데이트
    console.log(invalidCounts);
    console.log(totalInvalidCounts);
  }, [excelData]); // Depend on excelData so this runs whenever excelData changes

  console.log(totalInvalidCounts);
  const columnNames = [
    "DB 분배일",
    "이름",
    "고객유형",
    "생년월일",
    "나이",
    "연락처",
    "주소",
  ];

  // handleCellChange 함수 내부에서 rowIndex의 범위를 확인할 때,
  // excelData 배열의 범위를 벗어나지 않는지 확인합니다.
  const handleCellChange = (e, rowIndex, cellIndex) => {
    const newValue = e.target.value;
    const isEmptyValue = newValue.trim() === "";
    // 셀의 유효성 검사 결과를 업데이트하는 로직을 여기에 추가해야 합니다.
    let isValid = true;
    console.log(
      `Cell change detected at row ${rowIndex + 1}, column ${
        cellIndex + 1
      }: ${newValue}`,
    );

    switch (cellIndex) {
      case 0:
        isValid = isEmptyValue || isValidDbDate(newValue); // Allow empty values
        break;
      case 1:
        // 이름 컬럼 처리: 빈값이 아닌 경우에 한해 유효성 검증
        isValid = !isEmptyValue && isValidName(newValue); // 이름은 빈값을 허용하지 않고 한글만 유효
        break;
      case 2:
        isValid = isEmptyValue || isValidCustomerType(newValue); // Allow empty values
        break;
      case 3:
        isValid = isEmptyValue || isValidBirthDate(newValue); // Allow empty values
        break;
      case 4:
        isValid = isValidAge(newValue);
        break;
      case 5:
        // 연락처 컬럼 처리: 빈값이 아닌 경우에 한해 유효성 검증
        isValid = !isEmptyValue
          ? formatAndValidateContact(newValue).isValid
          : false;
        break;
      case 6:
        isValid = isEmptyValue || isValidResidence(newValue); // Allow empty values
        break;

      // 추가적인 컬럼에 대한 유효성 검사가 필요한 경우 여기에 로직 추가...
    }

    const modifiedCellIndex = modifiedCells.findIndex(
      (modCell) =>
        modCell.rowIndex === rowIndex && modCell.cellIndex === cellIndex,
    );
    if (modifiedCellIndex >= 0) {
      modifiedCells[modifiedCellIndex] = {
        ...modifiedCells[modifiedCellIndex],
        newValue,
        isValid,
      };
    } else {
      modifiedCells.push({ rowIndex, cellIndex, newValue, isValid });
    }

    // Directly update invalidCounts based on the new validity
    const newInvalidCounts = [...invalidCounts];
    // Determine if the cell was previously counted as invalid
    const cellPreviouslyInvalid = invalidCounts[cellIndex] > 0;

    if (isValid && cellPreviouslyInvalid) {
      // Correctly decrease the count if the cell becomes valid
      newInvalidCounts[cellIndex]--;
    } else if (!isValid && !cellPreviouslyInvalid) {
      // Correctly increase the count if the cell becomes invalid
      newInvalidCounts[cellIndex]++;
    }

    // Update the modifiedCells state
    const existingIndex = modifiedCells.findIndex(
      (mc) => mc.rowIndex === rowIndex && mc.cellIndex === cellIndex,
    );

    if (existingIndex > -1) {
      const updatedCell = {
        ...modifiedCells[existingIndex],
        newValue,
        isValid,
        isEmpty: isEmptyValue,
      };
      console.log(
        `Updating cell at rowIndex: ${rowIndex}, cellIndex: ${cellIndex} with`,
        updatedCell,
      );
      modifiedCells[existingIndex] = updatedCell;
    } else {
      const newModifiedCell = {
        rowIndex,
        cellIndex,
        newValue,
        isValid,
        isEmpty: isEmptyValue,
      };
      console.log(
        `Adding new modified cell for rowIndex: ${rowIndex}, cellIndex: ${cellIndex}:`,
        newModifiedCell,
      );
      modifiedCells.push(newModifiedCell);
    }

    setModifiedCells([...modifiedCells]);
    setInvalidCounts(newInvalidCounts);
  };
  return (
    <>
      <div>
        {!isNextClicked && (
          <>
            <Modal className="excelupload-modal-style" show={show}>
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
                    <div class="flex">
                      <div class="h-10 w-[782px] rounded border border-Gray-scale-100 bg-LightMode-Background px-4 py-2">
                        <label
                          htmlFor="file-upload"
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
            <Modal
              className={`excelupload-modal-style2 ${
                totalInvalidCounts > 0 ? "h-[630px]" : "h-[574px]"
              }`}
              show={show}
            >
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
                <div class="h-10 w-[782px] rounded border border-Gray-scale-100 bg-LightMode-Background px-4 py-2">
                  <label
                    htmlFor="file-upload"
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
              <div class="mx-9 mt-6 bg-Gray-scale-50/20">
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
                  <table>
                    <tbody class=" w-full  text-[11px]">
                      {excelData
                        .slice(1)
                        .filter(isRowNotEmpty)
                        .map((row, rowIndex) => {
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
                                    ? row[cellIndex].toString()
                                    : "";
                                let baseClassName;

                                // Determine if the cell is empty, mandatory, and if it has been modified and is valid
                                let isEmpty = cellData.toString().trim() === "";
                                let isMandatory = [1, 5].includes(cellIndex); // Assuming columns 1 (name) and 5 (contact) are mandatory
                                let modifiedCell = modifiedCells.find(
                                  (modCell) =>
                                    modCell.rowIndex === rowIndex &&
                                    modCell.cellIndex === cellIndex,
                                );
                                // 실시간 유효성 검사를 반영하는 로직
                                let isValid = true; // 기본값 설정
                                if (modifiedCell) {
                                  // 수정된 셀에 대한 로직
                                  isValid = modifiedCell.isValid;
                                  isEmpty = modifiedCell.isEmpty;
                                }

                                // Determine if the cell is being edited
                                const isEditing = isEditMode && modifiedCell;

                                // Determine the validation state for class application
                                let isValidState, isEmptyState;
                                if (isEditing) {
                                  // Use the modified state for edited cells
                                  isValidState = modifiedCell.isValid;
                                  isEmptyState = modifiedCell.isEmpty;
                                } else {
                                  // Use the initial validation state for unedited cells
                                  isValidState = isValid; // Assuming 'isValid' reflects the initial validation
                                  isEmptyState = isEmpty; // Assuming 'isEmpty' reflects the initial empty check
                                }
                                // let displayData = cellData;
                                // 여기서는 className을 설정하는 로직을 필요에 따라 수정해야 할 수 있습니다.
                                switch (cellIndex) {
                                  case 0:
                                    // Transform and validate the date format directly
                                    const transformedDate = formatDate(
                                      cellData.toString(),
                                    );
                                    cellData = transformedDate; // Use the transformed date for display
                                    isValid =
                                      isEmpty || isValidDbDate(transformedDate); // Validate the transformed date
                                    // if (!isValid) incrementInvalidCount(0);
                                    baseClassName = "td-db-date";
                                    break;
                                  case 1:
                                    isValid = !isEmpty
                                      ? isValidName(cellData)
                                      : true;
                                    isMandatory = true; // 이름은 필수 항목
                                    // if (!isValid) incrementInvalidCount(1);
                                    baseClassName = "td-name";
                                    break;
                                  case 2:
                                    isValid =
                                      isEmpty || isValidCustomerType(cellData);
                                    // if (!isValid) incrementInvalidCount(2);
                                    baseClassName = "td-customer-type";
                                    break;
                                  case 3:
                                    // 생년월일 데이터 변환
                                    const formattedBirthDate = formatDate(
                                      cellData.toString(),
                                    );
                                    cellData = formattedBirthDate; // 변환된 날짜를 사용
                                    isValid =
                                      isEmpty ||
                                      isValidBirthDate(formattedBirthDate); // 변환된 날짜의 유효성 검사

                                    // if (!isValid) incrementInvalidCount(3);
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
                                    isValid = !isEmpty
                                      ? formatAndValidateContact(cellData)
                                          .isValid
                                      : true;
                                    isMandatory = true; // 연락처는 필수 항목
                                    baseClassName = "td-contact";
                                    break;
                                  case 6:
                                    isValid =
                                      isEmpty || isValidResidence(cellData);
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
                                // 필수 항목이면서 값이 비어 있을 경우, 유효하지 않음
                                if (isMandatory && isEmpty) {
                                  isValid = false;
                                }

                                // Append 'cell-invalid' class if data is invalid
                                // Adjust className based on isEmpty, isMandatory, and isValid
                                let className = `${baseClassName} ${
                                  isEmptyState && !isMandatory
                                    ? "bg-Secondary-100/60" //기존 아마 Secondary-50/80
                                    : "bg-white"
                                } ${!isValidState ? "cell-invalid" : ""} ${
                                  isEmptyState && isMandatory
                                    ? "cell-invalid"
                                    : ""
                                } `;
                                // 유효하지 않은 값에 대해서도 빨강 배경
                                // 필수 항목이면서 비어 있으면 빨강 배경
                                // let className = `${baseClassName} ${
                                //   modifiedCell && modifiedCell.isEmpty
                                //     ? "bg-Secondary-50/80" // 비어있는 값에 대한 배경색
                                //     : !modifiedCell || !modifiedCell.isValid
                                //       ? "cell-invalid" // 유효하지 않은 값에 대한 배경색
                                //       : "" // 유효한 값에 대한 배경색은 없음
                                // }`;

                                return (
                                  <td
                                    key={cellIndex}
                                    className={`${className} ${
                                      isEditMode ? "td-focused-within" : ""
                                    }`}
                                  >
                                    {isEditMode ? (
                                      <input
                                        type="text"
                                        defaultValue={cellData}
                                        className="text-input-class"
                                        onChange={(e) =>
                                          handleCellChange(
                                            e,
                                            rowIndex,
                                            cellIndex,
                                          )
                                        }
                                      />
                                    ) : (
                                      cellData
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 유효하지 않은 값이 존재하는 경우에만 표시 */}
              {totalInvalidCounts > 0 && (
                <div class="mt-10 flex justify-center text-xs font-semibold text-LightMode-Text">
                  {invalidCounts.map((count, index) => {
                    if (index < columnNames.length) {
                      // columnNames의 길이를 초과하지 않도록 체크
                      return (
                        <div class="mr-5 flex" key={index}>
                          {`${columnNames[index]}`} :{" "}
                          <p class="ml-1 text-xs font-extrabold text-Danger-600">{`${count
                            .toString()
                            .padStart(2, "0")}`}</p>
                        </div>
                      );
                    }
                    return null; // columnNames의 길이를 초과하는 경우 렌더링하지 않음
                  })}
                </div>
              )}
              {/* 유효하지 않은 값이 없는 경우에만 표시 */}
              {totalInvalidCounts === 0 ? (
                <div class="mt-6 flex w-full flex-col text-center text-xs font-light text-LightMode-Text">
                  <div>파일의 내용이 알맞게 삽입되었는지 확인해보세요.</div>
                  <div>
                    엑셀 등록 이후, 잘못된 정보는 개별 삭제만 가능하오니
                    유의바랍니다.
                  </div>
                </div>
              ) : (
                <div class="mt-6 flex w-full flex-col text-center text-xs font-light text-Danger-500">
                  <div>파일의 내용이 알맞게 삽입되었는지 확인해주세요.</div>
                  <div>
                    엑셀 등록 이후, 잘못된 정보는 개별 삭제만 가능하오니
                    유의바랍니다.
                  </div>
                </div>
              )}
              <div class="mt-6 flex justify-center text-xs font-semibold text-Primary-400  underline underline-offset-[3px]">
                <button onClick={() => setIsEditMode(!isEditMode)}>
                  바로 수정하기
                </button>{" "}
              </div>
              <div class="mt-10 flex w-full justify-center">
                <button
                  class="text-Gray mr-3 h-10 w-[310px] border text-Gray-scale-50 hover:bg-Primary-400 hover:text-white"
                  onClick={handleprevClick}
                >
                  {isEditMode ? "취소" : "이전"}
                </button>
                <button
                  class="h-10 w-[310px] border bg-Primary-400 text-white"
                  onClick={handleSubmit}
                >
                  {isEditMode ? "변경사항 저장" : "저장"}
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
