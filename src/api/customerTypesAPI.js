// src/api/customerTypesAPI.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_MAIN_URL}/customerType`;

//고객유형 정보 가져오기
export const fetchCustomerTypes = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 60 seconds delay
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
// /v1/hide?customerTypePk={customerType-pk}
// 고객유형 정보 수정(숨기기 요청)
export const updateCustomerType = async ({ pk, delYn }) => {
  const response = await axios.post(
    `${process.env.REACT_APP_MAIN_URL}/hide?customerTypePk=${pk}`,
    { delYn },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};
