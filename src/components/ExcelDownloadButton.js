import React from "react";
import * as XLSX from "xlsx";
import excelIcon from "../external/icons8-excel-24 (1).png";

const ExcelDownloadButton = ({ customers, activeType }) => {
  // 주어진 컬럼 설정
  //   console.log(customer.registerDate);
  //   console.log(customer);
  console.log(customers);
  const columns = [
    { header: "DB분배일", key: "registerDate", width: "270px" },
    { header: "고객유형", key: "customerTypeString", width: "90px" },
    { header: "이름", key: "name", width: "90px" },
    { header: "생년월일", key: "birth", width: "200px" },
    { header: "나이", key: "age", width: "100px" },
    { header: "연락처", key: "phone", width: "150px" },
    { header: "거주지", key: "address", width: "250px" },
    { header: "특이사항", key: "memo", width: "500px" },
    { header: "계약체결여부", key: "contractYn", width: "80px" },

    // ... 나머지 컬럼 설정
  ];

  const generateExcelFile = () => {
    // 헤더 생성
    const wsHeaders = columns.map((column) => column.header);

    // 데이터 생성
    const wsData = customers.map((customer) =>
      columns.map((column) => {
        // key에 "."이 포함된 경우 객체의 깊은 값을 가져옴
        const keys = column.key.split(".");
        let value = customer;
        keys.forEach((key) => {
          value = value[key];
        });
        return value;
      })
    );

    const ws = XLSX.utils.aoa_to_sheet([wsHeaders, ...wsData]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // 파일명 생성 로직
    const month =
      customers[0]?.registerDate?.split("-")[1] ||
      customers[0]?.createdAt.split("-")[1];
    const filename = `${month}월 ${activeType}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  return (
    <button
      onClick={generateExcelFile}
      style={{
        border: "2px solid #13AE5B",
        padding: "3px 3px",
        borderRadius: "4px",
        backgroundColor: "#FFF",
        color: "#FFF",
      }}
    >
      <img src={excelIcon}></img>
    </button>
  );
};

export default ExcelDownloadButton;
