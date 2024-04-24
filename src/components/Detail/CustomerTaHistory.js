import TaHistoryModal from "../Modal/TaHistoryModal";
import React from "react";
import { useState, useEffect } from "react";
import EditModalTA from "../Modal/EditModalTA";
import ContextMenu from "../Modal/ContextMenu";
import { useCustomerTa } from "../../hooks/CustomerTa/useCustomerTa";
import { useUpdateCustomerTa } from "../../hooks/CustomerTa/useUpdateCustomerTa";
import { useDeleteCustomerTa } from "../../hooks/CustomerTa/useDeleteCustomerTa";

const CustomerTaHistory = ({ customerPk, setIsTaHistoryModalOpen }) => {
  const [refresh, setRefresh] = useState(false); // 화면 새로고침을 위한 상태 추가
  const [selectedTA, setSelectedTa] = useState(null);
  const [showEditModalH, setShowEditModalH] = useState(false);
  const { data: customerTa, isLoading, error } = useCustomerTa(customerPk);
  const editMutation = useUpdateCustomerTa();
  const deleteMutation = useDeleteCustomerTa();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  const handleModalHClose = () => {
    setShowEditModalH(false); // EditModalH를 닫는 부분
    setIsTaHistoryModalOpen(false); // 상태를 false로 설정
    setRefresh((prevRefresh) => !prevRefresh); // 모달이 닫힐 때 새로고침 상태 변경
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
    setSelectedTa(history);
    setShowEditModalH(true); // EditModalH를 여는 부분
    setIsTaHistoryModalOpen(true); // 상태를 true로 설정
    editMutation.mutate({
      pk: history.pk,
      date: history.date,
      time: history.time,
      memo: history.memo,
      status: history.status,
    });
    setContextMenu({ ...contextMenu, visible: false });
  };
  const handleDelete = (history) => {
    deleteMutation.mutate(history.pk);
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

  const taTypeDisplay = {
    ABSENCE: "부재",
    REJECTION: "거절",
    PROMISE: "확약",
    AS_TARGET: "AS",
  };
  const taTypeColors = {
    AS: "var(--Success-200)",
    부재: "var(--Success-300)",
    확약: "var(--Success-500)",
    거절: "var(--Success-700)",
  };

  // Rendering logic
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="flex h-4/6 w-1/2 justify-center border border-Danger-300  bg-LightMode-SectionBackground pt-6">
      <div className="flex w-1/3 border border-Success-800 pl-6  text-sm">
        <div class="flex w-[100px] cursor-default flex-row border border-Primary-300 pl-4">
          전화상담{" "}
          <TaHistoryModal
            customerPk={customerPk}
            setIsTaHistoryModalOpen={setIsTaHistoryModalOpen} // HistoryModal에 함수 전달
          />
        </div>
      </div>
      <div class="w-[330px] border border-gray-700">
        {customerTa.map((history) => (
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
            className="history-container w-full"
          >
            <div class="border border-Danger-200">
              <div
                className="historyItemStyle1 h-5 w-[70px] border border-Primary-400"
                style={{ color: taTypeColors[taTypeDisplay[history.status]] }}
              >
                {taTypeDisplay[history.status]}
              </div>
            </div>
            <div class="flex w-[200px] flex-col justify-center border border-Success-900">
              <div className="historyItemStyle2 border border-Primary-400">
                <div class="mr-2 h-5 w-10 border border-Warning-400 text-sm">
                  {history.count}차{" "}
                </div>
                {history.date}{" "}
                <div class="ml-2 border border-Success-200">
                  {" "}
                  {history.time}
                </div>
              </div>
              <div className="historyItemStyle3 border border-Danger-500 ">
                {history.memo}
              </div>
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
        {selectedTA && (
          <EditModalTA
            show={showEditModalH}
            onHide={handleModalHClose}
            selectedTA={selectedTA}
            onSave={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerTaHistory;
