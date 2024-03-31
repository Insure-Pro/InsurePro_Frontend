// CustomerTypeButtons.js
import React from "react";
import { customerTypeColors } from "../../constants/customerTypeColors";

const CustomerTypeButtons = ({
  selectedCustomerType,
  handleCustomerTypeClick,
}) => {
  return (
    <div className="flex h-12 w-52 items-center overflow-x-scroll whitespace-nowrap">
      {Object.keys(customerTypeColors).map((type, idx, array) => {
        const isFirst = idx === 0;
        const isLast = idx === array.length - 1;
        let buttonStyle = {
          color:
            selectedCustomerType === type ? "white" : "var(--Gray-scale-100)",
          backgroundColor:
            selectedCustomerType === type
              ? customerTypeColors[type]
              : "transparent",
          borderColor:
            selectedCustomerType === type
              ? customerTypeColors[type]
              : "var(--Gray-scale-100)",
          fontWeight: selectedCustomerType === type ? "bold" : "normal",
          borderLeftWidth: isFirst ? "1px" : "0.5px", // Adjusted for consistency
          borderRightWidth: "0.5px", // Always 0.5px except last button
        };

        // Apply rounded corners for the first and last button
        if (isFirst) {
          buttonStyle.borderTopLeftRadius = "4px";
          buttonStyle.borderBottomLeftRadius = "4px";
        }
        if (isLast) {
          buttonStyle.borderTopRightRadius = "4px";
          buttonStyle.borderBottomRightRadius = "4px";
          buttonStyle.borderRightWidth = "1px"; // Adjusted for the last button
        }

        return (
          <button
            key={type}
            className="flex h-7 w-12 items-center border border-gray-300 px-[14px] py-[5px] outline-none"
            type="button"
            style={buttonStyle}
            // ref={type}
            onClick={() => handleCustomerTypeClick(type)}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
};

export default CustomerTypeButtons;
