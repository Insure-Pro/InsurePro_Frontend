import TaHistoryModal from "../Modal/TaHistoryModal";
import React from "react";
import { useState, useEffect } from "react";
import EditModalTA from "../Modal/EditModalTA";
import ContextMenu from "../Modal/ContextMenu";
import { useCustomerTa } from "../../hooks/CustomerTa/useCustomerTa";
import { useUpdateCustomerTa } from "../../hooks/CustomerTa/useUpdateCustomerTa";
import { useDeleteCustomerTa } from "../../hooks/CustomerTa/useDeleteCustomerTa";
import SkeletonHistory from "../../Skeleton/SkeletonHistory";

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
    PENDING: "보류",
  };
  const taTypeColors = {
    보류: "var(--Success-500)",
    부재: "var(--Warning-300)",
    확약: "var(--Primary-400)",
    거절: "var(--Danger-400)",
  };

  // Rendering logic
  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    // <div className="flex h-4/6 w-1/2 justify-center border border-Danger-300  bg-LightMode-SectionBackground pt-6">
    <div className="flex h-4/6 w-1/2 justify-center  bg-white pt-6">
      <div className="flex w-1/3 pl-[44px]  text-sm">
        <div class="mr-10 flex w-[100px] cursor-default flex-row">
          전화상담{" "}
          <TaHistoryModal
            customerPk={customerPk}
            setIsTaHistoryModalOpen={setIsTaHistoryModalOpen} // HistoryModal에 함수 전달
          />
        </div>
      </div>
      <div class="w-[330px]">
        {isLoading ? (
          <div class="flex flex-col">
            <SkeletonHistory />
            <SkeletonHistory />
            <SkeletonHistory />
            <SkeletonHistory />
            <SkeletonHistory />
          </div>
        ) : (
          <>
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
                className="history-container w-[320px]"
              >
                <div class="flex h-5 w-[70px]  ">
                  <div
                    class="mt-1 h-2 w-2 rounded-xl"
                    style={{
                      backgroundColor:
                        taTypeColors[taTypeDisplay[history.status]],
                    }}
                  ></div>
                  <div
                    className="historyItemStyle1 h-5 w-[40px] "
                    style={{
                      color: "var(--Secondary-500)",
                    }}
                  >
                    {taTypeDisplay[history.status]}
                  </div>
                  {/* <div
                    className="historyItemStyle1 h-5 w-[70px] border border-Primary-400"
                    style={{
                      color: taTypeColors[taTypeDisplay[history.status]],
                    }}
                  >
                    {taTypeDisplay[history.status]}
                  </div> */}
                </div>
                <div class="flex w-[220px] flex-col justify-center ">
                  <div className="historyItemStyle2 ">
                    <div class="mr-2 h-5 w-10 text-sm">{history.count}차 </div>
                    {history.date} <div class="ml-2 "> {history.time}</div>
                  </div>
                  <div className="historyItemStyle3 ">{history.memo}</div>
                </div>
              </div>
            ))}
          </>
        )}
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
