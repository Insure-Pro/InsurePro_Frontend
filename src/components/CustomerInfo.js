import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditModalD from "./Modal/EditModalD";

const CustomerInfo = ({ onUpdateSuccess, data }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(data);

  const imageUrl = process.env.PUBLIC_URL + "/edit1.png";

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  return (
    <div class="flex  flex-row pb-3 pt-6">
      <div className="detailTitle ">
        세부정보{" "}
        <div>
          <img
            className="userName pl-1 text-gray-400"
            src={imageUrl}
            style={{
              cursor: "pointer",
            }}
            onClick={handleEditClick}
          />
          <EditModalD
            show={showEditModal}
            onClose={(updatedData) => {
              // 업데이트된 데이터로 상태를 변경합니다.
              setSelectedCustomer(updatedData);
            }}
            onHide={() => setShowEditModal(false)}
            selectedCustomer={data}
            onUpdateSuccess={onUpdateSuccess}
          />
        </div>
      </div>
      <div>
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
  );
};
export default CustomerInfo;
