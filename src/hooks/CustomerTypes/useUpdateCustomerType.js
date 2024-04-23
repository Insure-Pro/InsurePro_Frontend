import { useMutation, useQueryClient } from "react-query";
import { updateCustomerType } from "../../api/customerTypesAPI";

export const useUpdateCustomerType = () => {
  const queryClient = useQueryClient(); // 쿼리 클라이언트 인스턴스

  return useMutation(updateCustomerType, {
    onSuccess: () => {
      queryClient.invalidateQueries("customerTypes"); // 업데이트 성공 후 고객 유형 쿼리를 무효화하여 데이터를 새로고침
    },
  });
};
