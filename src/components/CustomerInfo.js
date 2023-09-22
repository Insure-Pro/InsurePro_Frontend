import "../App.css";

const CustomerInfo = ({ info }) => {
  //   console.log(customer);
  return (
    <div className="customer-info-container">
      <h3 className="CustomerInfo_title">고객정보</h3>
      <hr />
      <div className="infoItem">
        <span>생년월일</span>
        <span className="infoSpan">
          {info.birth} (만 {info.age}세)
        </span>
      </div>
      <div className="infoItem">
        <span>주소</span>
        <span className="infoSpan">{info.address}</span>
      </div>
      <div className="infoItem">
        <span>고객 관리 시기</span>
        <span className="infoSpan">{info.intensiveCareStartDate}</span>
      </div>
      <div className="infoItem">
        <span>메모</span>
        <span className="infoSpan">{info.memo}</span>
      </div>
    </div>
  );
};
export default CustomerInfo;
