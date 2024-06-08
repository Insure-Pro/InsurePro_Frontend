import HistoryModal from "../Modal/HistoryModal";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import EditModalH from "../Modal/EditModalH";
import ContextMenu from "../Modal/ContextMenu";
import { useCustomerProgress } from "../../hooks/CustomerProgress/useCustomerProgress";
import { useUpdateCustomerProgress } from "../../hooks/CustomerProgress/useUpdateCustomerProgress";
import { useDeleteCustomerProgress } from "../../hooks/CustomerProgress/useDeleteCustomerProgress";
import SkeletonHistory from "../../Skeleton/SkeletonHistory";

const MobileCustomerHistory = ({ customerPk, setIsHistoryModalOpen }) => {
  const [refresh, setRefresh] = useState(false); // 화면 새로고침을 위한 상태 추가
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showEditModalH, setShowEditModalH] = useState(false);
  const {
    data: customerProgress,
    isLoading,
    error,
  } = useCustomerProgress(customerPk);
  const editMutation = useUpdateCustomerProgress();
  const deleteMutation = useDeleteCustomerProgress();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  //모바일 웹에서는 마우스 우클릭이 안 됨 -> 모바일웹에서는 클릭으로 바꿔사용하기 위함
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
    setIsHistoryModalOpen(false); // 상태를 false로 설정
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
    setSelectedHistory(history);
    setShowEditModalH(true); // EditModalH를 여는 부분
    setIsHistoryModalOpen(true); // 상태를 true로 설정

    // Assuming history is the object containing the edited data
    editMutation.mutate({
      pk: history.pk,
      date: history.date,
      address: history.address,
      memo: history.memo,
      progress: history.progress,
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

  const progressTypeDisplay = {
    AP: "초회상담",
    PC: "상품제안",
    ST: "증권전달",
  };

  const progressTypeColors = {
    초회상담: "var(--Success-300)",
    상품제안: "var(--Success-500)",
    증권전달: "var(--Success-700)",
  };

  // Rendering logic
  // if (isLoading) return <div class="placeholder:">Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    // <div className="flex h-4/6 w-full justify-center  bg-LightMode-SectionBackground pt-6">
    <div className="mt-6 flex h-4/6 w-full  justify-center bg-white">
      {/* <div className="flex h-10 w-[150px] pl-5 text-sm">
        <div class="flex w-full cursor-default  flex-row ">
          진척도{" "}
          <HistoryModal
            customerPk={customerPk}
            setIsHistoryModalOpen={setIsHistoryModalOpen} // HistoryModal에 함수 전달
          />
        </div>
      </div> */}
      <div class="w-[320px] ">
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
            {customerProgress.map((history) => (
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
                <div class="">
                  <div
                    className="historyItemStyle1 "
                    style={{
                      color:
                        progressTypeColors[
                          progressTypeDisplay[history.progress]
                        ],
                    }}
                  >
                    {progressTypeDisplay[history.progress]}
                  </div>
                </div>
                <div class="w-[320px] ">
                  <div className="historyItemStyle2 w-full ">
                    <div class="w-[86px] ">{history.date} </div>
                    <div class="ml-3"> {history.address}</div>
                  </div>
                  <div className="historyItemStyle3">{history.memo}</div>
                </div>
              </div>
            ))}
            <button
              class="mb-[54px] flex h-[40px] w-full items-center justify-between px-[90px] text-xs font-normal text-Primary-400"
              //   onClick={() => setIsAddingType(true)}
            >
              <HistoryModal
                customerPk={customerPk}
                setIsHistoryModalOpen={setIsHistoryModalOpen} // HistoryModal에 함수 전달
              />
              새로운 일정 추가하기{" "}
            </button>
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
        {selectedHistory && (
          <EditModalH
            show={showEditModalH}
            onHide={handleModalHClose}
            selectedHistory={selectedHistory}
            onSave={handleEdit} // Pass handleEdit as a prop to be called upon saving
          />
        )}
      </div>
    </div>
  );
};

export default MobileCustomerHistory;
