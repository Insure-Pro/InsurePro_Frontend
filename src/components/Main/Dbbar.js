import React, { useState } from "react";
import "../../App.css";
import Nav from "react-bootstrap/Nav";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { customerTypeColors } from "../../constants/customerTypeColors";

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
  onTypeChange,
  activeType, // 이제 이 prop을 사용합니다.
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

  const showDateBar = useSelector((state) => state.navbar.showDateBar);

  const [hoveredItem, setHoveredItem] = useState(null);

  // const moveItem = (fromIndex, toIndex) => {
  //   const updatedItems = [...items];
  //   const [movedItem] = updatedItems.splice(fromIndex, 1);
  //   updatedItems.splice(toIndex, 0, movedItem);

  //   setItems(updatedItems);
  // };

  const handleTypeClick = (type) => {
    // setActiveType(type);
    onTypeChange(type); // 선택한 유형을 부모 컴포넌트로 전달
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div class="Dbbar">
        <div>
          <div
            class={`ml-6   ${
              showDateBar ? "mt-9" : "mt-0"
            } flex  h-[36px] w-[1024px]  bg-white`}
          >
            <Nav>
              {items.map((item) => (
                <Nav.Link
                  key={item.key}
                  className="ml-6 inline-block h-[36px] w-[42px] py-2 text-center text-sm text-black"
                  onClick={() => handleTypeClick(item.label)}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  // 유형별로 hover click시에만 해당 색으로 변경
                  style={{
                    fontWeight:
                      activeType === item.label || hoveredItem === item.label
                        ? "bold"
                        : "normal",
                    color:
                      activeType === item.label || hoveredItem === item.label
                        ? customerTypeColors[item.label]
                        : "black",
                    borderBottom:
                      activeType === item.label || hoveredItem === item.label
                        ? `2px solid ${customerTypeColors[item.label]}`
                        : "none",
                  }}
                >
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Dbbar;
