import HistoryModal from "../components/HistoryModal";
import { useRef, useState } from "react";

const CustomerHistory = ({ histories }) => {
  const [customerHistories, setCustomerHistories] = useState([]);

  const handleAddHistory = (histories) => {
    setCustomerHistories((prevHistories) => [histories, ...prevHistories]);
  };
  return (
    <div className="customerHistorySection">
      <h3 className="CustomerHistory_title">
        고객히스토리
        <HistoryModal onAddHistory={handleAddHistory} />
        {/* <img src="edit.png" alt="Edit Icon" className="editIcon" /> */}
      </h3>
      <hr />
      {/* {histories.map((history) => (
        <div key={history.id} className="historyItem">
          <span className="progress">{history.progress}</span>
          <span className="historySpan">
            {history.date} {history.location}
          </span>
          <p className="historyP">{history.memo}</p>
        </div>
      ))} */}
    </div>
  );
};

export default CustomerHistory;
