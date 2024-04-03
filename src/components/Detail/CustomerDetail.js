import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import EditModalD from "../Modal/EditModalD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "../../App.css";
import { customerTypeColors } from "../../constants/customerTypeColors";

const CustomerDetail = ({
  onUpdateSuccess,
  data,
  customerPk,
  onEditClick,
  showEditModal,
  onCloseModal,
}) => {
  const navigate = useNavigate();
  const imageUrl = process.env.PUBLIC_URL + "/edit1.png";
  const checkbox = process.env.PUBLIC_URL + "/checkbox-12.png";

  const [selectedCustomer, setSelectedCustomer] = useState(data); // initialCustomerData는 초기 고객 데이터입니다.

  return (
    <div className="customer-detail-container">
      <div className="backpage flex items-center ">
        <span
          className="mx-auto h-full w-[200px] items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{ marginRight: "16px" }}
          />
          고객 관리 리스트로 돌아가기
        </span>
        <div class="h-full w-[862px]"></div>
      </div>
      <div class="flex h-[162px] w-full flex-row justify-center bg-LightMode-SectionBackground pt-6">
        <div className="detailTitle ">
          {" "}
          기본정보{" "}
          <div class="flex h-[20px] w-[20px] items-end">
            <img
              className=" mb-0.5 ml-1 flex cursor-pointer items-end pb-[1px] pl-1 text-gray-400"
              src={imageUrl}
              onClick={onEditClick} // EditModalD를 열기 위해 클릭 이벤트 연결
            />
            <EditModalD
              show={showEditModal}
              onClose={(updatedData) => {
                // 업데이트된 데이터로 상태를 변경합니다.
                setSelectedCustomer(updatedData);
              }}
              onHide={onCloseModal} // This function updates the state to close the modal
              selectedCustomer={data}
              onUpdateSuccess={onUpdateSuccess}
            />
          </div>
        </div>
        <div class="flex h-full w-[622px] flex-col items-center">
          <div class="mx-auto h-full w-full ">
            <div class="flex">
              <div
                class="mb-1.5 text-[17px] font-bold "
                style={{
                  color: customerTypeColors[data.customerType],
                }}
              >
                {data.customerType}
              </div>
              {data.contractYn && ( // 조건부 렌더링: data.contractYn이 true일 경우만 아래의 div를 렌더링
                <div class="mb-1.5 ml-2 flex w-[70px] items-center text-[10px] text-Primary-400">
                  <img src={checkbox} class="mr-1 h-3 w-3" /> 계약완료고객
                </div>
              )}
            </div>
            <div style={{ cursor: "default" }}>
              <div
                class={`${
                  data.contractYn ? "text-Primary-400" : "text-LightMode-Text"
                } flex text-[17px] font-bold `}
              >
                <div class="pt-0.5">{data.name}</div>
                <div class="mb-3  ml-1 text-base font-normal">
                  {" "}
                  (만 {data.age}세)
                </div>
              </div>
            </div>

            <div class="mb-3 text-sm" style={{ cursor: "default" }}>
              {data.dongString}
            </div>
            <div class=" text-sm" style={{ cursor: "default" }}>
              {data.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerDetail;
