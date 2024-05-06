import { useState, useEffect } from "react";
import axios from "axios";
import hangjungdong from "../../components/Modal/hangjungdong";

const useCustomerFormHandlers = (customer, mode) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    birth: "",
    phone: "",
    memo: "",
    state: "",
    customerTypePk: "",
    metroGuDong: { metroName: "", guName: "", dongName: "" },
    contractYn: false,
    registerDate: "",
  });

  const [sidoOptions, setSidoOptions] = useState([]);
  const [sigugunOptions, setSigugunOptions] = useState([]);
  const [dongOptions, setDongOptions] = useState([]);

  useEffect(() => {
    setSidoOptions(hangjungdong.sido.map((sido) => ({ name: sido.codeNm })));
  }, [hangjungdong]);

  useEffect(() => {
    if (formData.metroGuDong.metroName) {
      const selectedSido = hangjungdong.sido.find(
        (sido) => sido.codeNm === formData.metroGuDong.metroName,
      );
      if (selectedSido) {
        const filteredSiguguns = hangjungdong.sigugun.filter(
          (sg) => sg.sido === selectedSido.sido,
        );
        setSigugunOptions(filteredSiguguns.map((sg) => ({ name: sg.codeNm })));

        if (formData.metroGuDong.guName) {
          const selectedSigugun = filteredSiguguns.find(
            (sg) => sg.codeNm === formData.metroGuDong.guName,
          );
          if (selectedSigugun) {
            const filteredDongs = hangjungdong.dong.filter(
              (d) => d.sigugun === selectedSigugun.sigugun,
            );
            setDongOptions(filteredDongs.map((d) => ({ name: d.codeNm })));
          }
        } else {
          setDongOptions([]);
        }
      }
    }
  }, [
    formData.metroGuDong.metroName,
    formData.metroGuDong.guName,
    hangjungdong,
  ]);

  // 의존성 배열에 customer를 문자열로 변환
  useEffect(() => {
    if (mode === "edit") {
      setFormData({
        name: customer.name || "",
        age: customer.age || "",
        birth: customer.birth || "",
        phone: customer.phone || "",
        memo: customer.memo || "",
        state: customer.state || "",
        customerTypePk: customer.customerType ? customer.customerType.pk : "",
        metroGuDong: customer.metroGuDong || {},
        contractYn: customer.contractYn || false,
        registerDate: customer.registerDate || "",
      });
    }
  }, [mode, customer]);
  // }, [mode, JSON.stringify(customer)]); // customer의 변화를 감지

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      metroGuDong: {
        ...prevFormData.metroGuDong,
        [name]: value,
      },
    }));
  };

  const handleToggleChange = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      contractYn: !prevFormData.contractYn,
    }));
  };

  const handleSubmit = (event, onSaveSuccess, onHide) => {
    event.preventDefault();

    const updatedFormData = { ...formData };
    const url =
      process.env.REACT_APP_MAIN_URL +
      (mode === "edit" ? `/customer/${customer.pk}` : "/customer");
    const method = mode === "edit" ? "patch" : "post";
    try {
      axios[method](url, updatedFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          onSaveSuccess(response.data);
          onHide(); // Close the modal on successful save
        }
      });
    } catch (error) {
      console.error("Failed to submit customer data:", error);
    }
  };

  return {
    formData,
    sidoOptions,
    sigugunOptions,
    dongOptions,
    handleInputChange,
    handleToggleChange,
    handleSubmit,
  };
};

export default useCustomerFormHandlers;
