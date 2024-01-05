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
      <Modal className="excelupload-modal-style  " show={show} onHide={onHide}>
        <div class="mb-6 h-8 rounded-t-md bg-gray-300 px-7 py-[7px] text-sm font-normal">
          <div class="flex justify-between ">
            <div>엑셀파일로 고객 추가</div>
            <img
              class="cursor-pointer"
              onClick={handleClose}
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            {/* <p>Please follow the guidelines...</p> */}
            <button class=" h-10 w-[310px] rounded border text-[17px] text-gray-300 hover:bg-primary-100  hover:text-white ">
              다음
            </button>
          </div>
          {/* Display Excel data in a table */}
          <table
            // striped
            bordered
            hover
            style={{ marginTop: "24px" }}
            className="green-striped my-custom-table table-striped"
          >
            <thead>
              <tr>
                <th>Db분배일</th>
                <th>이름</th>
                <th>고객유형</th>
                <th>생년월일</th>
                <th>나이</th>
                <th>연락처</th>
                <th>거주지</th>
                <th>특이사항</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "10px" }}>
              {excelData.slice(1).map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ExcelUploadModal;
