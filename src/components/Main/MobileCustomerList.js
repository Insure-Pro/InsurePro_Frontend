import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { customerTypeColors } from "../../constants/customerTypeColors";

function MobileCustomerList({
  customers,
  handleCustomerClick,
  handleContextMenu,
}) {
  if (customers.length === 0) {
    return <p className="mb-1 mt-3">일치하는 고객이 없습니다.</p>;
  }
  const mobileMenuIcon = process.env.PUBLIC_URL + "/mobileMenuIcon.png";

  return (
    <>
      <div class=" flex w-full justify-center">
        <div
          class={`sm:[380px] xsm:grid-cols-2 xsm:gap-1 mx-4 grid h-full gap-1 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 md:gap-3 `}
        >
          {customers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((customer) => (
              <div
                key={customer.pk}
                data-id={customer.pk}
                onContextMenu={(e) => handleContextMenu(e, customer)}
                className="  "
              >
                <ListGroup
                  className=""
                  key={customer.pk}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <div class="">
                    <div className="customerCardWrapper h-[122px] w-[162px] rounded border-[0.5px] border-black bg-white py-3 pl-4 pr-2">
                      <div class="mb-2 flex justify-between">
                        <div class="flex">
                          <button
                            style={{
                              width: "24px",
                              height: "16px",
                              backgroundColor:
                                customerTypeColors[customer.customerType],
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "4px",
                            }}
                          >
                            <span class="text-[10px] font-normal text-white">
                              {customer.customerType}
                            </span>
                          </button>
                          <button class="flex h-4 w-[44px] items-center justify-center rounded border border-Success-300 bg-Success-50">
                            <span class="text-[10px] font-normal text-Success-300">
                              상담현황
                            </span>
                          </button>
                        </div>
                        <div>
                          <img src={mobileMenuIcon} />
                        </div>
                      </div>
                      <div class="mb-1 flex text-sm text-LightMode-Text">
                        <div class="mr-2"> {customer.name}</div>{" "}
                        <div> ({customer.age})</div>
                      </div>

                      <div class="mb-2 flex text-xs text-LightMode-Subtext">
                        {customer.phone}
                      </div>
                      <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                        분배일 : {customer.registerDate}{" "}
                      </div>
                      <div class="flex text-[10px] font-normal text-Secondary-300">
                        주소 : {customer.dongString}
                        {customer.address}{" "}
                      </div>
                    </div>
                  </div>
                </ListGroup>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default MobileCustomerList;
