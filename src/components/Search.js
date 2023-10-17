import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";

const Search = ({ setCustomers }) => {
  const [inputName, setInputName] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://3.38.101.62:8080/v1/customers/name/${inputName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error("Error fetching customers by name:", error);
      // Handle error accordingly, maybe set an error state and display an error message to the user
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginLeft: "370px",

        // marginBottom: "12px",
        marginTop: "-10px",
      }}
      // variant={"primary"}
    >
      <input
        type="name"
        placeholder="검색하려는 이름을 입력해주세요."
        style={{
          display: "flex",
          width: "250px",
          height: "36px",
          padding: "13px", // 아이템 내부 여백 조절
          marginLeft: "8px",
          border: "none",
          borderRadius: "5px",
          marginRight: "8px",
          border: "2px solid #175CD3",
          borderRadius: "8px",
          paddingRight: "4px",
        }}
        onChange={(e) => setInputName(e.target.value)}
        onKeyDown={handleOnKeyDown} // Enter 입력 이벤트 함수
      ></input>
      <button
        style={{
          width: "60px",
          height: "36px",
          borderRadius: "8px",
          backgroundColor: "#175cd3",
          color: "#fff",
          border: "none",
        }}
        onClick={handleSearch}
        // onClick={}
      >
        검색
      </button>
    </div>
  );
};

export default Search;
