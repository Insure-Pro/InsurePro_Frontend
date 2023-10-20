import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditModalD from "../components/EditModalD";

const CustomerInfo = ({ onUpdateSuccess, data }) => {
  const navigate = useNavigate();
  // Step 1: Add a state to manage the visibility of the EditModal
  const [showEditModal, setShowEditModal] = useState(false);
  const [customerData, setCustomerData] = useState(data);
  const [selectedCustomer, setSelectedCustomer] = useState(data); // initialCustomerData는 초기 고객 데이터입니다.
  // Step 2: Add an event handler that sets showEditModal to true when the edit icon is clicked

  const handleUpdateSuccess = (updatedCustomerData) => {
    setSelectedCustomer(updatedCustomerData);
  };

  return (
    <div style={{ margin: "-10px 0px" }}>
      <div>
        {/* <hr /> */}
        <div className="infoItem">
          <span>생년월일dd</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {data.birth} (만 {data.age}세)
          </span>
        </div>
        <div className="infoItem">
          <span>주소</span>
          <span className="infoSpan" style={{ marginLeft: "115px" }}>
            {data.address}
          </span>
        </div>
      </div>
      <div>
        <div className="infoItem">
          <span>특이사항</span>
          <span className="infoSpan" style={{ marginLeft: "80px" }}>
            {data.memo}
          </span>
        </div>
        <div className="infoItem">
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

            // selectedCustomer={data} // Pass the customer data to the EditModal
          />
        </div>
      </div>
    </div>
  );
};
export default CustomerInfo;
