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
      <Modal size="lg" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Excel Upload Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>엑셀 파일 추가시 가이드라인</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <p>Please follow the guidelines...</p>
          <Form.Control type="file" onChange={handleFileChange} />
          {/* Display Excel data in a table */}
          <Table
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
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExcelUploadModal;
