// CustomerTypeButtons.js
import React from "react";
import { useCustomerTypes } from "../../hooks/useCustomerTypes";

const CustomerTypeButtons = ({
  selectedCustomerType,
  handleCustomerTypeClick,
}) => {
  const { data: customerTypes, isLoading } = useCustomerTypes();

  return (
    <div className="flex h-12 w-52 items-center overflow-x-scroll whitespace-nowrap">
      {customerTypes.map((type, idx, array) => {
        const isFirst = idx === 0;
        const isLast = idx === array.length - 1;
        let buttonStyle = {
          color:
            selectedCustomerType.pk === type.pk
              ? "white"
              : "var(--Gray-scale-100)",
          backgroundColor:
            selectedCustomerType.pk === type.pk ? type.color : "transparent",
          borderColor:
            selectedCustomerType.pk === type.pk
              ? type.color
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
            key={type.pk}
            className="flex h-7 w-12 items-center border border-gray-300 px-[14px] py-[5px] outline-none"
            type="button"
            style={buttonStyle}
            // ref={type}
            onClick={() => {
              handleCustomerTypeClick({ pk: type.pk, name: type.name });
              // console.log("버튼을 클릭하긴 했네요");
            }}
          >
            {type.name}
          </button>
        );
      })}
    </div>
  );
};

export default CustomerTypeButtons;
