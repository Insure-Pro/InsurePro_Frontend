import React from "react";

const InputField = ({
  label,
  type,
  value,
  name,
  onChange,
  placeholder,
  className,
}) => (
  <div className="CustomerModal_item_container">
    <div className="w-[84px]">{label}</div>
    <input
      className={`modal_item_input  ${className}`}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export default InputField;
