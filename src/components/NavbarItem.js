import React from "react";

const NavbarItem = ({
  selectedTab,
  onAllCustomersClick,
  onMonthCustomersClick,
  onContractCompleteClick,
  handleTabClick,
  handleTabChange,
  toggleDropdown,
  handleshowDateClick,
  handleCloseDateClick,
}) => {
  const getTabStyle = (tabName) => {
    return `navbar-client-item cursor-pointer ${
      selectedTab === tabName
        ? "font-bold text-LightMode-text"
        : "font-light text-LightMode-Subtext"
    }`;
  };
  return (
    <div className="navbar-client">
      <div
        className={getTabStyle("전체")}
        onClick={() => {
          onAllCustomersClick();
          handleTabClick("전체");
          toggleDropdown();
          handleCloseDateClick();
        }}
      >
        전체
      </div>
      <div
        className={getTabStyle("월별 고객")}
        onClick={() => {
          handleTabClick("월별 고객");
          onMonthCustomersClick();
          toggleDropdown();
          handleshowDateClick();
        }}
      >
        월별 고객
      </div>
      <div
        className={getTabStyle("계약완료고객")}
        onClick={() => {
          onContractCompleteClick();
          handleTabClick("계약완료고객");
          toggleDropdown();
          handleCloseDateClick();
        }}
      >
        계약 완료
      </div>
      <div
        className={getTabStyle("Map")}
        onClick={() => handleTabChange("Map")}
      >
        위치 기반
      </div>
    </div>
  );
};

export default NavbarItem;
