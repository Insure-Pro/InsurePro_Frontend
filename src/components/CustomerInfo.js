import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditModalD from "./Modal/EditModalD";

const CustomerInfo = ({ onUpdateSuccess, data }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(data);

  return (
    <div className="customer_info_container" style={{ margin: "-10px 0px" }}>
      <div>
        <div className="infoItem" style={{ cursor: "default" }}>
          <span>생년월일</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {data.birth} (만 {data.age}세)
          </span>
        </div>
        <div className="infoItem" style={{ cursor: "default" }}>
          <span>주소</span>
          <span
            className="infoSpan infoSpanaddress"
            style={{ marginLeft: "114px" }}
          >
            {data.dongString}
            {data.address}
          </span>
        </div>
      </div>
      <div>
        <div className="infoItem" style={{ cursor: "default" }}>
          <span>특이사항</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {data.memo}
          </span>
        </div>
        <div className="infoItem" style={{ cursor: "default" }}>
          <span>인수상태</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {data.state}
          </span>
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
    </div>
  );
};
export default CustomerInfo;
