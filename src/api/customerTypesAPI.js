// src/api/customerTypesAPI.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_MAIN_URL}/customerType`;

export const fetchCustomerTypes = async () => {
  const response = await axios.get(`${API_URL}s/employee`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  const allTypesOption = { name: "All", pk: 0 }; // Add 'All' option with pk=0
  return [allTypesOption, ...response.data];
};

export const addCustomerType = async ({ name, dataType }) => {
  const response = await axios.post(
    `${API_URL}`,
    { name, dataType },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};
