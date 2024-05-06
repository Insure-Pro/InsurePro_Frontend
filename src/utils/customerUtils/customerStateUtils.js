import hangjungdong from "../../components/Modal/hangjungdong";

export const updateCustomerTypeAndContract = (
  selectedCustomer,
  setSelectedCustomerType,
  setContractYn,
) => {
  if (selectedCustomer) {
    setSelectedCustomerType(selectedCustomer?.customerType || "");
    setContractYn(selectedCustomer?.contractYn || false);
  }
};

export const updateLocationDetails = (
  selectedCustomer,
  setSelectedSido,
  setSelectedSigugun,
  setSelectedDong,
) => {
  if (selectedCustomer && selectedCustomer.metroGuDong) {
    const sidoId =
      hangjungdong.sido.find(
        (el) => el.codeNm === selectedCustomer.metroGuDong.metroName,
      )?.sido || "";
    const sigugunId =
      hangjungdong.sigugun.find(
        (el) =>
          el.codeNm === selectedCustomer.metroGuDong.guName &&
          el.sido === sidoId,
      )?.sigugun || "";
    const dongId =
      hangjungdong.dong.find(
        (el) =>
          el.codeNm === selectedCustomer.metroGuDong.dongName &&
          el.sido === sidoId &&
          el.sigugun === sigugunId,
      )?.dong || "";
    setSelectedSido(sidoId);
    setSelectedSigugun(sigugunId);
    setSelectedDong(dongId);
  }
};
