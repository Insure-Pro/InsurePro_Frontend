// hooks/useConsultationStatus.js

import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_MAIN_URL}/customer`;

const fetchCustomer = async (customerPk) => {
  const { data } = await axios.get(`${API_URL}/${customerPk}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return data;
};

const updateConsultationStatus = async ({ customerPk, status }) => {
  const response = await axios.patch(
    `${API_URL}/${customerPk}`,
    { consultationStatus: status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};

export const useCustomer = (customerPk) => {
  return useQuery(["customer", customerPk], () => fetchCustomer(customerPk), {
    refetchOnWindowFocus: false,
  });
};

export const useUpdateConsultationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(updateConsultationStatus, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["customer", variables.customerPk]);
    },
  });
};
