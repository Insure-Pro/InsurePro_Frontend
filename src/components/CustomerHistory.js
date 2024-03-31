import HistoryModal from "./Modal/HistoryModal";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import EditModalH from "./Modal/EditModalH";
import ContextMenu from "./Modal/ContextMenu";

const CustomerHistory = ({ customerPk, setIsHistoryModalOpen }) => {
  const [refresh, setRefresh] = useState(false); // 화면 새로고침을 위한 상태 추가
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
    setShowEditModalH(false); // EditModalH를 닫는 부분
    setIsHistoryModalOpen(false); // 상태를 false로 설정
    setRefresh((prevRefresh) => !prevRefresh); // 모달이 닫힐 때 새로고침 상태 변경
    fetchData();
  };

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    xPos: 0,
    yPos: 0,
    history: null,
  });

  const handleContextMenu = (event, history) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      xPos: event.pageX,
      yPos: event.pageY,
      history: history,
    });
  };

  const handleEdit = (history) => {
    setSelectedHistory(history);
    setShowEditModalH(true); // EditModalH를 여는 부분
    setIsHistoryModalOpen(true); // 상태를 true로 설정
    fetchData();
    // Edit logic
    setContextMenu({ ...contextMenu, visible: false });
  };
  const handleDelete = async (history) => {
    await handleDeleteClick(history);
    setContextMenu({ ...contextMenu, visible: false });
  };
  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () =>
      setContextMenu({ ...contextMenu, visible: false });
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  const progressTypeColors = {
    TA: "var(--Success-200)",
    AP: "var(--Success-300)",
    PT: "var(--Success-500)",
    PC: "var(--Success-700)",
  };

  const progressTypeWidth = {
    TA: "7.5px",
    AP: "15px",
    PT: "22.5px",
    PC: "30px",
  };

  const progressTypeGradient = {
    TA: "linear-gradient(270deg, #34A853 2.22%, #77C58C 52.58%, #A2D7B0 100%)",
    AP: "linear-gradient(270deg, #77C58C 0%, #AEDCBA 100%)",
    PT: "linear-gradient(270deg, #34A853 2.22%, #77C58C 52.58%, #A2D7B0 100%)",
    PC: "linear-gradient(270deg, rgba(37, 119, 59, 0.80) 0.06%, rgba(52, 168, 83, 0.80) 32.96%, rgba(119, 197, 140, 0.80) 64.39%, rgba(162, 215, 176, 0.80) 98.27%) ",
  };

  return (
    <div className="flex h-4/6  bg-LightMode-SectionBackground pt-6">
      <div className="detailTitle ">
        <div class="flex flex-row" style={{ cursor: "default" }}>
          히스토리{" "}
          <HistoryModal
            customerPk={customerPk}
            onNewData={fetchCustomerHistory}
            setIsHistoryModalOpen={setIsHistoryModalOpen} // HistoryModal에 함수 전달
          />
        </div>
      </div>
      <div>
        {histories.map((history) => (
          <div
            key={history.pk}
            onContextMenu={(e) => {
              e.preventDefault();
              handleContextMenu(e, history);
            }}
            onClick={(e) => {
              if (windowWidth <= 700) {
                e.preventDefault();
                handleContextMenu(e, history);
              }
            }}
            className="history-container"
          >
            <div>
              <div
                className="historyItemStyle1"
                style={{ color: progressTypeColors[history.progress] }}
              >
                {history.progress}
              </div>
              <div class="mr-[28px] mt-1 h-[5px] w-[30px] rounded-lg bg-white">
                <div
                  class="h-[5px] rounded-lg"
                  style={{
                    background: progressTypeGradient[history.progress],
                    width: progressTypeWidth[history.progress],
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="historyItemStyle2">
                {history.date} <div class="ml-6"> {history.address}</div>
              </div>
              <div className="historyItemStyle3">{history.memo}</div>
            </div>
          </div>
        ))}
        {contextMenu.visible && (
          <ContextMenu
            history={contextMenu.history}
            onEdit={handleEdit}
            onDelete={handleDelete}
            xPos={contextMenu.xPos}
            yPos={contextMenu.yPos}
            showMenu={contextMenu.visible}
          />
        )}
        {/* 히스토리 항목들을 렌더링하는 코드... */}
        {selectedHistory && (
          <EditModalH
            show={showEditModalH}
            onHide={handleModalHClose}
            selectedHistory={selectedHistory}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerHistory;
