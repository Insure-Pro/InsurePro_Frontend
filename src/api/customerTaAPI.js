import axios from "axios";

const API_URL = `${process.env.REACT_APP_MAIN_URL}/ta`;

// Ta 추가 요청
export const addCustomerTa = async ({
  date,
  time,
  memo,
  count,
  status,
  customerPk,
}) => {
  const response = await axios.post(
    `${API_URL}`,
    { date, time, memo, count, status, customerPk },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};

//Ta 정보 가져오기
export const fetchCustomerTa = async (customerPk) => {
  // await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds delay
  const response = await axios.get(`${API_URL}s/${customerPk}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
};

// Ta 정보 수정
export const editCustomerTa = async ({
  pk,
  date,
  time,
  count,
  memo,
  status,
}) => {
  const response = await axios.patch(
    `${API_URL}/${pk}`,
    {
      date,
      time,
      count,
      memo,
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};

//Ta 정보 삭제
export const deleteCustomerTa = async (pk) => {
  const response = await axios.delete(
    `${API_URL}/${pk}`,
    // {
    //   delYn: true,
    // },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};
