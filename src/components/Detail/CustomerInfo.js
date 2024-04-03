import "../../App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EditModalD from "../Modal/EditModalD";

const CustomerInfo = ({
  onUpdateSuccess,
  data,
  customerPk,
  showEditModal,
  onEditClick,
  onCloseModal,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(data);

  const imageUrl = process.env.PUBLIC_URL + "/edit1.png";

  return (
    <div class="flex w-full justify-center pb-3 pt-6">
      <div className="detailTitle ">
        세부정보{" "}
        <div class="flex h-[20px] w-[20px] items-end">
          <img
            className="userName mb-1 ml-1 pl-1 text-gray-400"
            src={imageUrl}
            style={{
              cursor: "pointer",
            }}
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
          <div className="infoItem">
            <span className="infoTitle">Db 분배일</span>
            <span className="infoSpan">{data.registerDate}</span>
          </div>
          <div className="infoItem">
            <span className="infoTitle">인수상태</span>
            <span className="infoSpan">{data.state}</span>
          </div>
          <div className="infoItem">
            <span className="infoTitle">특이사항</span>
            <span className="infoSpan">{data.memo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerInfo;
