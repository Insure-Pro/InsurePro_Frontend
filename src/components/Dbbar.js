import React, { useState } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";
import Nav from "react-bootstrap/Nav";
import Search from "../components/Search";
import DateChangeModal from "./DateChangeModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  // formattedDate,
  // setFormattedDate,
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

  // const [customers, setCustomers] = useState([]); // 상태를 추가하여 고객 데이터를 저장합니다.

  const [activeType, setActiveType] = useState("All"); // 초기 선택값을 "All"로 설정
  const [selectedTab, setSelectedTab] = useState("");

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
    // fetchData(); // 데이터를 다시 불러옴
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
    // setFormattedDate(formattedDate2);
    // setCustomers(fetchedData); // Assuming you have a setCustomers function to update the customer data.
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    setItems(updatedItems);
  };

  const handleTypeClick = (type) => {
    setActiveType(type);
    onTypeChange(type); // 선택한 유형을 부모 컴포넌트로 전달
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="navbar-container">
          <Navbar
            onContractCompleteClick={onContractCompleteClick}
            onAllCustomersClick={onAllCustomersClick}
            onMonthCustomersClick={() => {
              handleMonthCustomersClick();
              // Here, we will pass the formattedDate value to the function in Main.js
              onMonthCustomersClick(formattedDate);
            }}
            ContractedCustomerClcik={handleContractCompleteClick}
            AllCustomersClick={handleAllCustomersClick}
            // setFormattedDate={setFormattedDate}
          />
          <div
            className="content"
            style={{
              marginLeft: "300px",
              // height: "100vh",
              minHeight: "100vh",
              borderRight: "2px solid #dde1e6",
            }}
          >
            <h1
              className="maintitle"
              onClick={handleFormattedDateClick}
              style={{ width: "300px" }}
            >
              {" "}
              {selectedTab === "월별 고객" ? formattedDateTitle : activeType}
              {/* {console.log(selectedTab)} */}
              {/* {console.log(formattedDate)} */}
            </h1>

            <Nav
              className="DbbarItem-container"
              variant="underline"
              defaultActiveKey="/home"
              // style={{ display: "flex", justifyContent: "space-between" }}
            >
              {items.map((item) => (
                <Nav.Link
                  key={item.key}
                  onClick={() => handleTypeClick(item.label)}
                  style={{ fontSize: "20px", marginLeft: "2px" }}
                >
                  {item.label}
                </Nav.Link>
              ))}
              <Search
                setCustomers={setCustomers}
                // style={{ marginLeft: "10px" }}
              />
            </Nav>
            <hr
              style={{
                marginTop: "-2px",
                marginLeft: "8px",
                height: "15px",
                width: "1030px",
              }}
            />
            {children}
          </div>
        </div>
        {isModalOpen && (
          <DateChangeModal
            initialYear={selectedYear}
            initialMonth={selectedMonth}
            onDateChange={handleDateChange}
            onClose={() => setIsModalOpen(false)}
            // setFormattedDate={setFormattedDate}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Dbbar;
