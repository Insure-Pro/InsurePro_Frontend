import React, { useState } from "react";
import "../App.css";
import Navbar from "./Navbar";
import Nav from "react-bootstrap/Nav";
import Search from "../components/Search";
import ExcelUploadModal from "./Modal/ExcelUploadModal";
import DateChangeModal from "./Modal/DateChangeModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { setSelectedTab } from "../redux/customerSlice";
import { useNavigate } from "react-router-dom";
const ItemType = "NAV_ITEM";

const DraggableNavItem = ({ item, index, moveItem }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <Nav.Item ref={(node) => ref(drop(node))}>
      <Nav.Link eventKey={item.key}>{item.label}</Nav.Link>
    </Nav.Item>
  );
};

const Dbbar = ({
  onAllCustomersClick,
  onContractCompleteClick,
  onMonthCustomersClick,
  children,
  onTypeChange,
  setCustomers,
}) => {
  const [items, setItems] = useState([
    { key: "link-1", label: "All" },
    { key: "link-2", label: "OD" },
    { key: "link-3", label: "AD" },
    { key: "link-4", label: "CP" },
    { key: "link-5", label: "CD" },
    { key: "link-6", label: "JD" },
    { key: "link-7", label: "H" },
    { key: "link-8", label: "X" },
    { key: "link-9", label: "Y" },
    { key: "link-10", label: "Z" },
  ]);

  const [activeType, setActiveType] = useState("All"); // 초기 선택값을 "All"로 설정
  const [selectedTab, setSelectedTab] = useState("");

  const [hoveredItem, setHoveredItem] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(
    2,
    "0"
  )}`; // formattedDate 업데이트

  const formattedDateTitle = `${selectedYear}년 ${String(
    selectedMonth
  ).padStart(2, "0")}월`; // formattedDate 업데이트
  const handleMonthCustomersClick = () => {
    setSelectedTab("월별 고객"); // 계약 완료 여부를 true로 설정
  };
  const handleAllCustomersClick = () => {
    setSelectedTab("전체");
  };

  const handleContractCompleteClick = () => {
    setSelectedTab("계약완료고객");
  };

  const handleFormattedDateClick = () => {
    if (selectedTab === "월별 고객") {
      setIsModalOpen(true);
    }
  };

  // 선택한 년, 월로 formattedDate를 업데이트하는 함수
  const handleDateChange = (newYear, newMonth, fetchedData) => {
    setSelectedYear(newYear);
    setSelectedMonth(newMonth);
    setIsModalOpen(false); // Optionally, close the modal after changing the date
    const formattedDate2 = `${newYear}-${String(newMonth).padStart(2, "0")}`;
    onMonthCustomersClick(formattedDate2);
  };

  // const moveItem = (fromIndex, toIndex) => {
  //   const updatedItems = [...items];
  //   const [movedItem] = updatedItems.splice(fromIndex, 1);
  //   updatedItems.splice(toIndex, 0, movedItem);

  //   setItems(updatedItems);
  // };

  const [showExcelModal, setShowExcelModal] = useState(false); // State to control Excel Modal visibility

  // Handler for opening Excel Modal
  const handleExcelModalShow = () => {
    setShowExcelModal(true);
  };

  // Handler for closing Excel Modal
  const handleExcelModalClose = () => {
    setShowExcelModal(false);
  };

  const handleTypeClick = (type) => {
    setActiveType(type);
    onTypeChange(type); // 선택한 유형을 부모 컴포넌트로 전달
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="Dbbar-container">
          <div className="content" style={{}}>
            {/* <span
              className="Excel_Customer_Add"
              style={{
                display: "flex",
                justifyContent: "end",
                paddingRight: "50px",
                marginBottom: "-30px",
                fontWeight: "600",
                opacity: "0.7",
                color: "#000",
                cursor: "pointer",
              }}
              onClick={handleExcelModalShow}
            >
              엑셀로 고객 추가하기
            </span> */}

            <Nav className="DbbarItem-container">
              {items.map((item) => (
                <Nav.Link
                  key={item.key}
                  className="DbbarItems"
                  onClick={() => handleTypeClick(item.label)}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    color: "#000",
                    fontSize: "14px",
                    marginLeft: "18px",
                    fontWeight:
                      activeType === item.label || hoveredItem === item.label
                        ? "bold"
                        : "normal",
                    borderBottom:
                      activeType === item.label || hoveredItem === item.label
                        ? "2px solid #000"
                        : "none",
                  }}
                >
                  {item.label}
                </Nav.Link>
              ))}
              {/* <Search setCustomers={setCustomers} /> */}
            </Nav>
            <hr
              className="Dbbar_hr"
              style={{
                width: "1024px",
                height: "2px",
                marginTop: "-2px",
              }}
            />
            {/* {children} */}
          </div>
        </div>
        {isModalOpen && (
          <DateChangeModal
            initialYear={selectedYear}
            initialMonth={selectedMonth}
            onDateChange={handleDateChange}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {showExcelModal && (
          <ExcelUploadModal
            show={showExcelModal}
            onHide={handleExcelModalClose}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Dbbar;
