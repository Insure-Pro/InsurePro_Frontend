// src/api/customerTypesAPI.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_MAIN_URL}/customerType`;

//고객유형 정보 가져오기
export const fetchCustomerTypes = async () => {
  const response = await axios.get(`${API_URL}s/employee`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  const allTypesOption = { name: "All", pk: 0 }; // Add 'All' option with pk=0
  return [allTypesOption, ...response.data];
};

// 고객유형 추가 요청
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

// 고객유형 숨기기 요청
export const updateCustomerType = async ({ pk, delYn }) => {
  const response = await axios.patch(
    `${API_URL}/${pk}`,
    { delYn },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};
