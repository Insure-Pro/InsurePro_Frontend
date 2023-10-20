import HistoryModal from "../components/HistoryModal";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import EditModalH from "../components/EditModalH";
import { Button } from "react-bootstrap";

const CustomerHistory = ({ customerPk }) => {
  const [refresh, setRefresh] = useState(false); // 화면 새로고침을 위한 상태 추가
  const [showOptions, setShowOptions] = useState(null); // ID of customer for which options should be shown
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showEditModalH, setShowEditModalH] = useState(false);
  const [histories, setHistories] = useState([]);

  const fetchCustomerHistory = async () => {
    try {
      const url = `http://3.38.101.62:8080/v1/schedules/${customerPk}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setHistories(response.data);
    } catch (error) {
      console.error("Error fetching customer history:", error.message);
    }
  };

  const handleRightClick = (e, historyId) => {
    e.preventDefault(); // 기본 우클릭 메뉴 차단
    setShowOptions((prevId) => (prevId === historyId ? null : historyId)); // 버튼 토글
  };
  // 수정 버튼 클릭 시, EditModalH를 띄우고 해당 히스토리 정보를 전달하는 이벤트 핸들러
  const handleEditHClick = (History) => {
    setSelectedHistory(History);
    setShowEditModalH(true);
    fetchData();
  };

  useEffect(() => {
    fetchCustomerHistory();
  }, [customerPk]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://insurepro.kro.kr/v1/schedules/${customerPk}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setHistories(response.data); // 가정: 응답의 데이터가 히스토리 목록임
        // console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching updated history:", error.message);
    }
  };

  const handleDeleteClick = async (history) => {
    try {
      const response = await axios.patch(
        `https://insurepro.kro.kr/v1/schedule/${history.pk}`,
        {
          delYn: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200) {
        // 이 곳에서 추가적인 작업 (상태 업데이트, UI 변경 등)을 수행할 수 있습니다.
        fetchData(); // 수정된 데이터를 다시 불러옵니다.
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const handleModalHClose = () => {
    setRefresh((prevRefresh) => !prevRefresh); // 모달이 닫힐 때 새로고침 상태 변경
    fetchData();
  };

  //진척도
  const historyItemStyle1 = {
    flex: "none",
    width: "90px",
    textAlign: "center",
    justifyContent: "center", //진척도 세로축 가운데 정렬
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderRadius: "5px",
    color: "#175CD3",
    fontSize: "20px",
    fontWeight: "700",
  };
  //시간,장소
  const historyItemStyle2 = {
    flex: "none", // flex 속성 제거
    width: "700px",
    textAlign: "start",
    padding: "2px", // 아이템 내부 여백 조절
    marginLeft: "8px",
    borderRightRadius: "20px",
    borderRadius: "5px",
    fontSize: "18px",
    fontWeight: "700",
    // borderRadius: "0 5px 5px 0",//오른쪽 모서리
  };
  //메모
  const historyItemStyle3 = {
    flex: "none", // flex 속성 제거
    width: "700px",
    textAlign: "start",
    padding: "2px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    fontSize: "16px",
    borderRadius: "5px",

    // borderRadius: "5px 0 0 5px",// 왼쪽모서리
  };
  //
  const historyItemStyle4 = {
    flex: "none", // flex 속성 제거
    width: "200px",
    textAlign: "center",
    padding: "13px", // 아이템 내부 여백 조절
    marginBottom: "8px",
    marginLeft: "8px",
    borderLeft: "1px solid #ddd",
    borderRadius: "5px",
  };
  return (
    <div className="customer-history-container">
      <div
        className="customer-histoy-top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "0px 26px",
        }}
      >
        <h5 style={{ fontWeight: "700" }}>고객 히스토리</h5>
        <HistoryModal
          customerPk={customerPk}
          onNewData={fetchCustomerHistory}
        />
      </div>
      {histories.map((history) => (
        <div
          key={history.pk}
          onContextMenu={(e) => {
            e.preventDefault();
            handleRightClick(e, history.pk);
          }}
          // onMouseDown={() => handleMouseDown(history.pk)}
          // onMouseUp={() => handleMouseUp(history)}
          style={{
            display: "flex",
            alignItems: "center", // 진척도 가로축 가운데 정렬

            width: "780px",
            margin: "4px",
            marginBottom: "16px",
            marginLeft: "164px",
            padding: "3px",
            backgroundColor: "#FFF",
            borderRadius: "13px",
            boxShadow: "10px 4px 4px 0px rgba(46, 64, 97, 0.10)",
          }}
        >
          <div style={historyItemStyle1}>{history.progress}</div>
          <div>
            <div style={historyItemStyle2}>
              {history.date} {history.address}
            </div>
            <div style={historyItemStyle3}>{history.memo}</div>
          </div>
          {showOptions === history.pk && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="outline-primary"
                onClick={() => handleEditHClick(history)}
                style={{
                  fontSize: "14px",
                  // fontWeight: "bold",
                  width: "58px",
                  height: "32px",
                  marginBottom: "6px",
                  paddingBottom: "10px",
                  marginLeft: "-10px",
                  boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.15)",
                }}
              >
                수정
              </Button>{" "}
              <Button
                variant="outline-danger"
                onClick={() => handleDeleteClick(history)}
                style={{
                  fontSize: "14px",
                  // fontWeight: "bold",
                  width: "58px",
                  height: "32px",
                  marginBottom: "6px",
                  paddingBottom: "10px",
                  marginLeft: "-10px",
                  boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.15)",
                }}
              >
                삭제
              </Button>{" "}
            </div>
          )}
        </div>
      ))}

      {/* 히스토리 항목들을 렌더링하는 코드... */}
      {selectedHistory && (
        <EditModalH
          show={showEditModalH}
          onHide={() => setShowEditModalH(false)}
          selectedHistory={selectedHistory}
          onClose={handleModalHClose}
          // onHistoryUpdated={onHistoryUpdated}
        />
      )}
    </div>
  );
};

export default CustomerHistory;
