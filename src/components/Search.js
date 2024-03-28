import axios from "axios";
import React, { useState, useRef } from "react";
import "../App.css";

const Search = ({ setCustomers, onClose }) => {
  const [inputName, setInputName] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 경고 메시지 상태 추가
  const name = useRef("");
  const search = process.env.PUBLIC_URL + "/search.png";

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${MAIN_URL}/customers/name/${inputName}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       },
  //     );
  //     if (response.status === 200) {
  //       setCustomers(response.data);
  //       setInputName("");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching customers by name:", error);
  //   }
  // };

  // const handleOnKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };
  const handleSearch = async () => {
    try {
      const response = await axios.request({
        method: "get",
        url: `${MAIN_URL}/customers/name/${inputName}`,
        data: {
          name: inputName,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        //response.data가 실제로 배열이며, 그 길이를 확인하여 일치하는 고객이 있는지를 결정하는 것
        if (response.data && response.data.length > 0) {
          setCustomers(response.data);
          onClose(); // 검색 컴포넌트 닫기
        } else {
          setCustomers([]); // 일치하는 고객이 없을 경우 빈 배열 전달
          onClose(); // 검색 컴포넌트 닫기
          // 응답이 성공적이지만 데이터가 반환되지 않은 경우 처리
        }
      }
      setInputName("");
    } catch (error) {
      console.error("Error fetching customers by name:", error);
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div
      style={{ display: "flex" }}
      class=" mb-10 mt-4 h-8 w-[536px] items-center rounded bg-LightMode-SectionBackground px-4 py-1"
    >
      <img class="mr-7 h-6 w-6" src={search} onClick={handleSearch}></img>
      <input
        type="name"
        placeholder="검색하려는 이름을 입력해주세요."
        style={{
          display: "flex",
          width: "400px",
          backgroundColor: "var(--LightMode-SectionBackground)",
          fontSize: "14px",
          fontWeight: "lighter",
          border: "none",
          color: "var(--LightMode-Text)",
          outline: "none",
        }}
        value={inputName}
        ref={name}
        onChange={(e) => setInputName(e.target.value)}
        onKeyDown={handleOnKeyDown} // Enter 입력 이벤트 함수
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        autoFocus
      ></input>
      {/* <button
        className="Search_button"
        style={{
          width: "60px",
          height: "36px",
          borderRadius: "8px",
          backgroundColor: isInputFocused ? "#175CD3" : "#98A2B3",
          color: isInputFocused ? "#fff" : "#fff",
          border: "none",
        }}
        onClick={handleSearch}
      >
        검색
      </button> */}
    </div>
  );
};

export default Search;
