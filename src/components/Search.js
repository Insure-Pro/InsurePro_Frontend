import axios from "axios";
import React, { useState } from "react";
import "../App.css";

const Search = ({ setCustomers }) => {
  const [inputName, setInputName] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.insurepro.kro.kr/v1/customers/name/${inputName}`,
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
        marginLeft: "316px",
        // marginBottom: "12px",
        marginTop: "-2px",
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
          fontSize: "14px",
          marginLeft: "8px",
          border: "none",
          borderRadius: "5px",
          marginRight: "8px",
          border: "2px solid #98A2B3",
          borderRadius: "8px",
          paddingRight: "4px",
        }}
        onChange={(e) => setInputName(e.target.value)}
        onKeyDown={handleOnKeyDown} // Enter 입력 이벤트 함수
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      ></input>
      <button
        style={{
          width: "60px",
          height: "36px",
          borderRadius: "8px",
          backgroundColor: isInputFocused ? "#175CD3" : "#98A2B3", // initial can be replaced with your default color
          color: isInputFocused ? "#fff" : "#fff", // initial can be replaced with your default color
          // backgroundColor: "#98A2B3",
          // color: "#667085",
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
