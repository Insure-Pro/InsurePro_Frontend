import React from "react";
import { Col, Form } from "react-bootstrap";

const SelectField = ({ label, options, value, onChange, name, disabled }) => (
  <Col>
    <div className="flex">
      {/* <span>
        <span className="Highlighting">*</span>
        {label}
      </span> */}
      <Form.Select
        className={`modal_address_item ${
          value
            ? "border-primary-100 text-black"
            : "border-gray-300 text-gray-300"
        }`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </Form.Select>
    </div>
  </Col>
);

export default SelectField;
