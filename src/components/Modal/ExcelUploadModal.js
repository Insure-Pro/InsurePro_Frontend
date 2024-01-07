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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
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
    return {
      name: rowData[1],
      customerType: rowData[2],
      registerDate: rowData[0],
      birth: rowData[3],
      age: rowData[4],
      phone: rowData[5],
      dongString: rowData[6],
      memo: rowData[7],
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

  return (
    <>
      <div>
        {!isNextClicked && (
          <>
            <Modal className="excelupload-modal-style  " show={show}>
              <div class="mb-6 h-8 rounded-t-md bg-gray-300 px-7 py-[7px] text-sm font-normal">
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
                <Form.Control type="file" onChange={handleFileChange} />
                <div>
                  <div eventKey="0">
                    <div class=" mt-3  flex h-[42px] items-center border bg-gray-300 pl-4 text-white">
                      엑셀 파일 추가시 가이드라인
                    </div>
                    <div class="mb-2 flex h-[85px] items-center justify-center border">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do
                    </div>
                  </div>
                </div>
                <div class="flex justify-end">
                  {/* <p>Please follow the guidelines...</p> */}
                  <button
                    class={`h-10 w-[310px] rounded border text-[17px] ${
                      file ? "bg-primary-100 text-white" : "text-gray-300"
                    }`}
                    onClick={handleNextClick}
                  >
                    다음
                  </button>
                </div>
              </div>
            </Modal>
          </>
        )}
        {isNextClicked && (
          // Contents rendered after 'Next' button is clicked
          <>
            <Modal className="excelupload-modal-style2  " show={show}>
              <div class="mb-6 h-8 rounded-t-md bg-gray-300 px-7 py-[7px] text-sm font-normal">
                <div class="flex justify-between ">
                  <div>엑셀파일로 고객 추가</div>
                  <img
                    class="cursor-pointer"
                    onClick={onHide}
                    src={close_icon}
                  />
                </div>
              </div>
              {/* Display Excel data in a table */}
              <div class="mx-3 mt-6">
                <div class="Excel-Item-Title mb-5 flex h-8 items-center  text-sm font-light text-white ">
                  <div class="w-20  ">Db분배일</div>
                  <div class="w-12 ">이름</div>
                  <div class="w-16 ">고객유형</div>
                  <div class="w-20 ">생년월일</div>
                  <div class="w-9 ">나이</div>
                  <div class="w-20 ">연락처</div>
                  <div class="w-24 ">거주지</div>
                  <div class="w-[100px] ">특이사항</div>
                </div>

                <tbody class="mx-3 w-full text-[11px]">
                  {excelData.slice(1).map((row, index) => (
                    <tr
                      className="mb-1 flex items-center justify-center"
                      key={index}
                    >
                      {row.map((cell, cellIndex) => {
                        let className;
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
                          // ... handle other cases similarly
                          // case 8:
                          //   className = "td-special-note";
                          //   break;
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
                  ))}
                </tbody>
              </div>
              <div class="mt-3 flex w-full flex-col text-center">
                <div>파일의 내용이 알맞게 삽입되었는지 확인해보세요.</div>
                <div>
                  엑셀 등록 이후, 잘못된 정보는 개별 삭제만 가능하오니
                  유의바랍니다.
                </div>
              </div>
              <div class="mt-3 flex w-full justify-center">
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
