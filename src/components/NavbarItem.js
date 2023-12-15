import React from "react";

const NavbarItem = ({
  selectedTab,
  setSelectedTab,
  onAllCustomersClick,
  onMonthCustomersClick,
  onContractCompleteClick,
  handleTabClick,
  AllCustomersClick,
  ContractedCustomerClcik,
  isAnalysisSelected,
  isMapSelected,
  handleMapClick,
}) => {
  return (
    <div className="navbar-client">
      <div
        className="navbar-client-item"
        onClick={() => {
          setSelectedTab("전체");
          onAllCustomersClick();
          handleTabClick("전체");
          AllCustomersClick();
        }}
        style={{
          backgroundColor: "#000",
          fontWeight:
            selectedTab === "전체" && !isAnalysisSelected && !isMapSelected
              ? "bold"
              : "300",
        }}
      >
        전체
      </div>
      <div
        className="navbar-client-item"
        onClick={() => {
          setSelectedTab("월별 고객");
          handleTabClick("월별 고객");
          onMonthCustomersClick();
        }}
        style={{
          fontWeight: selectedTab === "월별 고객" ? "bold" : "300",
        }}
      >
        월별 고객
      </div>
      <div
        className="navbar-client-item"
        onClick={() => {
          setSelectedTab("계약완료고객");
          onContractCompleteClick();
          handleTabClick("계약완료고객");
          ContractedCustomerClcik();
        }}
        style={{
          fontWeight: selectedTab === "계약완료고객" ? "bold" : "300",
        }}
      >
        계약 완료
      </div>
      <div
        className="navbar-client-item"
        onClick={handleMapClick}
        style={{
          backgroundColor: isMapSelected ? "#175cd3" : "transparent",
          fontWeight: selectedTab === "위치 기반" ? "bold" : "300",
        }}
      >
        위치 기반
      </div>
    </div>
  );
};

export default NavbarItem;
