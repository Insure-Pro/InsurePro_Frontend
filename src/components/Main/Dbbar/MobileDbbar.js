import React, { useState, useRef, useEffect } from "react";
import "../../../App.css";
import "../Dbbar/MobileDbbar.css";
import { customerTypeColors } from "../../../constants/customerTypeColors";
import { useCustomerTypes } from "../../../hooks/useCustomerTypes";

const MobileDbbar = ({ activeType, items, onTypeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dropdown = process.env.PUBLIC_URL + "/dropdown.png";
  const dropup = process.env.PUBLIC_URL + "/dropup.png";

  const { data: customerTypes, isLoading } = useCustomerTypes();
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

  return (
    <div class=" h-full w-full ">
      <div className="Dbbar-dropdown" ref={dropdownRef}>
        <button
          className={`Dbbar-dropdown-toggle ${
            isOpen
              ? "border-b-[0.5px] border-LightMode-Text"
              : "border-b-[0.5px]  border-LightMode-SectionBackground "
          } `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-center space-x-[250px] sm:space-x-[410px] md:space-x-[588px]">
            {" "}
            {/* Added flex container */}
            <span>{activeType}</span>{" "}
            {/* Wrapped in <span> for potential styling */}
            {isOpen ? (
              <img src={dropup} alt="Dropup" />
            ) : (
              <img src={dropdown} alt="Dropdown" />
            )}
          </div>
        </button>
        {isOpen && (
          <ul className="Dbbar-dropdown-menu">
            {customerTypes
              .filter((type) => type.name !== activeType)
              ?.map((type) => (
                <li
                  key={type.key}
                  className="Dbbar-dropdown-item"
                  onClick={() => {
                    onTypeChange(type.name);
                    setIsOpen(false);
                  }}
                  style={{
                    color: activeType === type.name ? "black" : type.color,
                  }}
                >
                  {type.name}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MobileDbbar;
