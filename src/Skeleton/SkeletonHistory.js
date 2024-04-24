import React from "react";
import SkeletonElement from "./SkeletonElement";

const SkeletonHistory = () => {
  return (
    <div className="skeleton-wrapper mb-4 flex h-[58px] w-[360px] items-center rounded bg-gray-200/30 px-[15px] ">
      <div className="historyItemStyle1 mr-[18px] pl-1">
        <SkeletonElement type="title" />
      </div>
      <div class="w-[360px]">
        <div class="historyItemStyle2 mb-2 flex">
          <SkeletonElement type="subtext1" />
          <SkeletonElement type="subtext2" />
        </div>
        <div class="flex flex-col">
          <SkeletonElement type="text" />
          {/* <SkeletonElement type="text" /> */}
        </div>
      </div>
    </div>
  );
};

// <div className="history-container w-[360px]">
//   <div class="">
//     <div className="historyItemStyle1 ">[history.progress]</div>
//   </div>
//   <div class="w-[360px]">
//     <div className="historyItemStyle2 w-full">
//       <div class="w-[86px]">{history.date} </div>
//       <div class="ml-3"> {history.address}</div>
//     </div>
//     <div className="historyItemStyle3">{history.memo}</div>
//   </div>
// </div>;

export default SkeletonHistory;
