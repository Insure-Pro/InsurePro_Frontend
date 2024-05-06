import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import CustomerTypeButtons from "../Button/CustomerTypeButtons";
import useCustomerFormHandlers from "../../hooks/CustomerInfo/useCustomerFormHandlers";
import {
  calculateKoreanAge,
  handlePhoneInputChange,
  updateCustomerTypeAndContract,
  updateLocationDetails,
} from "../../utils/customerUtils";
import InputField from "./InputField";
import ToggleSwitch from "./ToggleSwitch";
import SelectField from "./SelectField";

const CustomerModal = ({ show, onHide, mode, customer, onSaveSuccess }) => {
  // Initial form data setup moved to useCustomerFormHandlers
  const {
    formData,
    sidoOptions,
    sigugunOptions,
    dongOptions,
    handleInputChange,
    handleToggleChange,
    handleSubmit,
  } = useCustomerFormHandlers(customer, mode);

  const close_icon = process.env.PUBLIC_URL + "/Close.png";

  const modalTitle = mode === "edit" ? "고객정보 수정" : "New Customer";

  return (
    <Modal show={show} onHide={onHide} className="modal-style-detail">
      <div class="flex h-8  rounded-t-md  bg-LightMode-SectionBackground px-7 py-[7px] text-sm font-normal">
        <div>{modalTitle}</div>
        <img class="cursor-pointer" onClick={onHide} src={close_icon} />
      </div>
      <div class="h-full w-full ">
        <div class="">
          <form
            // className="Modal_container"
            class="flex flex-col items-center justify-center"
            onSubmit={(e) => handleSubmit(e, onSaveSuccess, onHide)}
          >
            <InputField
              label="이름"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-[82px]"
              placeholder=""
            />
            <ToggleSwitch
              isChecked={formData.contractYn}
              onChange={handleToggleChange}
              labels={{ checked: "계약완료 고객", unchecked: "계약 미완료" }}
            />
            <InputField
              label="나이 (만)"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="pl-[82px]"
              placeholder=""
            />
            {/* Address selection using SelectField components */}
            {/* <InputField
              label="상세 주소"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              className="ml-[84px] px-3"
              placeholder="상세 주소 입력"
            /> */}
            <div class="flex">
              <SelectField
                label="시/도"
                options={sidoOptions}
                value={formData.metroGuDong.metroName}
                onChange={handleInputChange}
                name="metroName"
              />
              <SelectField
                label="구/군"
                options={sigugunOptions}
                value={formData.metroGuDong.guName}
                onChange={handleInputChange}
                name="guName"
                disabled={!formData.metroGuDong.metroName}
              />
              <SelectField
                label="동"
                options={dongOptions}
                value={formData.metroGuDong.dongName}
                onChange={handleInputChange}
                name="dongName"
                disabled={!formData.metroGuDong.guName}
              />
            </div>
            <InputField
              label=""
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="pl-[52px]"
              placeholder="상세 주소 입력"
            />
            <InputField
              label="DB 분배일"
              type="date"
              name="registerDate"
              value={formData.registerDate}
              onChange={handleInputChange}
              className="pl-[52px]"
              placeholder="2023.00.00"
            />
            <InputField
              label="생년월일"
              type="date"
              name="birth"
              value={formData.birth}
              onChange={handleInputChange}
              className="pl-[52px]"
              placeholder="2023.00.00"
            />
            <InputField
              label="전화번호"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="pl-[52px]"
              placeholder="01012345678"
            />
            <InputField
              label="인수상태"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="pl-[52px]"
              placeholder="상담중, 전산완료, 가입불가 등"
            />
            <InputField
              label="특이사항"
              type="text"
              name="memo"
              value={formData.memo}
              onChange={handleInputChange}
              className="pl-[52px]"
              placeholder="월 보험료 00만원/본인점검"
            />
            {/* Submit button etc. */}
            {/* Submit Button */}
            <button
              class="flex h-[40px] w-[278px] items-center justify-center rounded border border-primary-100 py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white"
              type="submit"
            >
              등록
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerModal;
