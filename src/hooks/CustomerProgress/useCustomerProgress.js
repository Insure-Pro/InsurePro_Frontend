// src/hooks/useCustomerProgress.js
import { useQuery } from "react-query";
import { fetchCustomerProgress } from "../../api/customerProgressAPI";

export const useCustomerProgress = (customerPk) => {
  return useQuery(
    ["customerProgress", customerPk],
    () => fetchCustomerProgress(customerPk),
    {
      enabled: !!customerPk, // only run query if customerPk is not null or undefined
    },
  );
};
