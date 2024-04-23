import axios from "axios";

const API_URL = `${process.env.REACT_APP_MAIN_URL}/schedule`;

// 진척도 추가 요청
export const addCustomerProgress = async ({
  date,
  address,
  memo,
  progress,
  customerPk,
}) => {
  const response = await axios.post(
    `${API_URL}/${customerPk}`,
    { date, address, memo, progress },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};

//진척도 정보 가져오기
export const fetchCustomerProgress = async (customerPk) => {
  const response = await axios.get(`${API_URL}s/${customerPk}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

// 진척도 정보 수정
export const editCustomerProgress = async ({
  pk,
  date,
  address,
  memo,
  progress,
}) => {
  const response = await axios.patch(
    `${API_URL}/${pk}`,
    {
      date,
      address,
      memo,
      progress,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};

//진척도 정보 삭제
export const deleteCustomerProgress = async (pk) => {
  const response = await axios.patch(
    `${API_URL}/${pk}`,
    {
      delYn: true,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};
