import axios from "axios";
import React, { useState } from "react";
import "../App.css";

const Search = ({ setCustomers }) => {
  const [inputName, setInputName] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);

  const search = process.env.PUBLIC_URL + "/search.png";

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${MAIN_URL}/customers/name/${inputName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (response.status === 200) {
        setCustomers(response.data);
        setInputName("");
      }
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
      className="Search_container"
      style={{
        display: "flex",
        alignItems: "center",
      }}
      class="mb-7 flex h-8 w-[536px] items-center rounded bg-LightMode-SectionBackground px-4 py-1 "
    >
      <img class="mr-7 h-6 w-6" src={search} onClick={handleSearch}></img>
      <input
        className="Search_input"
        type="name"
        placeholder="검색하려는 이름을 입력해주세요."
        style={{
          display: "flex",
          width: "400px",
          backgroundColor: "var(--LightMode-SectionBackground)",
          fontSize: "14px",
          fontWeight: "lighter",
          border: "none",
          color: "white",
        }}
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        onKeyDown={handleOnKeyDown} // Enter 입력 이벤트 함수
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
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
      >
        검색
      </button> */}
    </div>
  );
};

export default Search;
