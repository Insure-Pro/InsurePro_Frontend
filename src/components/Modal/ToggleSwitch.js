import React from "react";

const ToggleSwitch = ({ isChecked, onChange, labels }) => {
  const checkedIcon = process.env.PUBLIC_URL + "/activate-check14.png";
  const uncheckedIcon = process.env.PUBLIC_URL + "/deactivate-check14.png";
  return (
    <div className="my-1 ml-[86px] flex items-center">
      <img
        src={isChecked ? checkedIcon : uncheckedIcon} // Define these icons in your assets or pass as props
        onClick={onChange}
        alt="Checkbox"
        className="mr-1 h-[14px] w-[14px] cursor-pointer"
      />
      <span
        className={`text-xs ${
          isChecked ? "text-Primary-400" : "text-Secondary-100"
        }`}
      >
        {isChecked ? labels.checked : labels.unchecked}
      </span>
    </div>
  );
};

export default ToggleSwitch;
