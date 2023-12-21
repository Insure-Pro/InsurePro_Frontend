import HistoryModal from "./Modal/HistoryModal";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import EditModalH from "./Modal/EditModalH";
import { Button } from "react-bootstrap";

const CustomerHistory = ({ customerPk }) => {
  const [refresh, setRefresh] = useState(false); // 화면 새로고침을 위한 상태 추가
  const [showOptions, setShowOptions] = useState(null); // ID of customer for which options should be shown
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showEditModalH, setShowEditModalH] = useState(false);
  const [histories, setHistories] = useState([]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const fetchCustomerHistory = async () => {
    try {
      const url = `${MAIN_URL}/schedules/${customerPk}`;
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
      const response = await axios.get(`${MAIN_URL}/schedules/${customerPk}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.status === 200) {
        setHistories(response.data); // 가정: 응답의 데이터가 히스토리 목록임
      }
    } catch (error) {
      console.error("Error fetching updated history:", error.message);
    }
  };

  const handleDeleteClick = async (history) => {
    try {
      const response = await axios.patch(
        `${MAIN_URL}/schedule/${history.pk}`,
        {
          delYn: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (response.status === 200) {
        fetchData(); // 수정된 데이터를 다시 불러옵니다.
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  useEffect(() => {
    // 창 크기가 변경될 때마다 windowWidth 상태를 업데이트
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const handleModalHClose = () => {
    setRefresh((prevRefresh) => !prevRefresh); // 모달이 닫힐 때 새로고침 상태 변경
    fetchData();
  };

  return (
    <div className="flex h-4/6 bg-gray-100 pt-6">
      <div className="detailTitle ">
        <div class="flex flex-row" style={{ cursor: "default" }}>
          히스토리{" "}
          <HistoryModal
            customerPk={customerPk}
            onNewData={fetchCustomerHistory}
          />
        </div>
      </div>
      <div>
        {histories.map((history) => (
          <div
            key={history.pk}
            onContextMenu={(e) => {
              e.preventDefault();
              handleRightClick(e, history.pk);
            }}
            onClick={(e) => {
              if (windowWidth <= 700) {
                e.preventDefault();
                handleRightClick(e, history.pk);
              }
            }}
            className="history-container"
          >
            <div className="historyItemStyle1">{history.progress}</div>
            <div>
              <div className="historyItemStyle2">
                {history.date} <div class="ml-6"> {history.address}</div>
              </div>
              <div className="historyItemStyle3">{history.memo}</div>
            </div>
            {showOptions === history.pk && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  className="history_edit_Btn"
                  variant="outline-primary"
                  onClick={() => handleEditHClick(history)}
                  style={{
                    fontSize: "14px",
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
                  className="history_edit_Btn"
                  variant="outline-danger"
                  onClick={() => handleDeleteClick(history)}
                  style={{
                    fontSize: "14px",
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
      </div>
      {/* 히스토리 항목들을 렌더링하는 코드... */}
      {selectedHistory && (
        <EditModalH
          show={showEditModalH}
          onHide={() => setShowEditModalH(false)}
          selectedHistory={selectedHistory}
          onClose={handleModalHClose}
        />
      )}
    </div>
  );
};

export default CustomerHistory;
