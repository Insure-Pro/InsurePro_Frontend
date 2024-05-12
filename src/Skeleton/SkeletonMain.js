import React from "react";
import SkeletonElement from "./SkeletonElement";

const SkeletonMain = () => {
  const mobileMenuIcon = process.env.PUBLIC_URL + "/mobileMenuIcon.png";
  return (
    <div className="skeleton-wrapper  flex h-[132px] w-[162px] flex-col rounded bg-Secondary-50/20  py-3 pl-4 pr-2 ">
      <div class="mb-2 flex justify-between">
        <div class="flex">
          <SkeletonElement type="customertype" />

          <SkeletonElement type="current" />
        </div>
        <div class=" h-5 w-5">
          <img src={mobileMenuIcon} />
        </div>
      </div>
      <div class="mb-1 flex items-center">
        {/* <div class="mr-0.5"> {customer.name}</div>{" "} */}
        <SkeletonElement type="name" />
        {/* <div class="mr-1.5"> ({customer.age})</div> */}
        {/* <img class="h-[14px] w-[14px]" src={check_off} /> */}
        <SkeletonElement type="circle" />
      </div>

      <div class="mb-2 ">
        <SkeletonElement type="phone" />
      </div>
      <div class="mb-2  ">
        <SkeletonElement type="registerDate" />
      </div>
      <div class="">
        <SkeletonElement type="address" />
      </div>
    </div>
  );
};

export default SkeletonMain;
