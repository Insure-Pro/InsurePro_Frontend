// src/components/CustomerTypes/CustomerTypesComponent.js
import React, { useState } from "react";
import {
  useCustomerTypes,
  useAddCustomerType,
} from "../../hooks/useCustomerTypes";
import "../../App.css";

function CustomerTypesComponent() {
  const [newTypeName, setNewTypeName] = useState("");
  const { data: customerTypes, isLoading } = useCustomerTypes();
  const addMutation = useAddCustomerType();

  if (isLoading) return <div>Loading...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    addMutation.mutate({ name: newTypeName });
    setNewTypeName("");
  };

  return (
    <div>
      {customerTypes?.map((type) => (
        <div key={type.id}>{type.name}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          placeholder="Add New Customer Type"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default CustomerTypesComponent;
