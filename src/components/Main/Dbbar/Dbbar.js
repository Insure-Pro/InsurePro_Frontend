import React, { useState, useRef, useEffect } from "react";
import "../../../App.css";
import Nav from "react-bootstrap/Nav";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { customerTypeColors } from "../../../constants/customerTypeColors";
import { useCustomerTypes } from "../../../hooks/useCustomerTypes";
import { useMediaQuery } from "react-responsive";
import MobileDbbar from "./MobileDbbar";

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
      {/* <Nav.Link eventKey={item.key}>{item.label}</Nav.Link> */}
    </Nav.Item>
  );
};

const Dbbar = ({
  onTypeChange,
  activeType, // 이제 이 prop을 사용합니다.
}) => {
  const showDateBar = useSelector((state) => state.navbar.showDateBar);

  const [hoveredItem, setHoveredItem] = useState(null);

  const isMobile = useMediaQuery({ query: "(max-width:768px)" });
  const isTablet = useMediaQuery({ query: "(max-width:960px)" });

  const { data: customerTypes, isLoading } = useCustomerTypes();

  const handleTypeClick = (type) => {
    onTypeChange({ name: type.name, pk: type.pk }); // 선택한 유형을 부모 컴포넌트로 전달
    console.log({ type }, 22);
  };

  //Mobile용
  //---------------------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  //---------------------------------------------------
  return (
    <DndProvider backend={HTML5Backend}>
      {isMobile ? (
        <MobileDbbar activeType={activeType} onTypeChange={handleTypeClick} />
      ) : (
        <div class="relative z-[2] ml-7 mt-2 flex justify-center">
          <div>
            <div
              class={`  ${showDateBar ? "mt-9" : "mt-0"} flex ${
                isTablet ? "ml-[-80px] justify-center" : "ml-6"
              }  h-[36px] w-[1024px]  bg-white`}
            >
              <Nav>
                {customerTypes?.map((type) => (
                  <div
                    key={type.pk}
                    className="ml-6 inline-block h-[36px] w-[42px] cursor-pointer py-2 text-center text-sm text-black"
                    onClick={() => handleTypeClick(type)}
                    onMouseEnter={() => setHoveredItem(type.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    // 유형별로 hover click시에만 해당 색으로 변경
                    style={{
                      fontWeight:
                        activeType === type.name || hoveredItem === type.name
                          ? "bold"
                          : "normal",
                      color:
                        activeType === type.name || hoveredItem === type.name
                          ? type.color
                          : "black",
                      borderBottom:
                        activeType === type.name || hoveredItem === type.name
                          ? `2px solid ${type.color}`
                          : "none",
                    }}
                  >
                    {type.name}
                  </div>
                ))}
              </Nav>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default Dbbar;
