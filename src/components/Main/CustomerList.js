import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { customerTypeColors } from "../../constants/customerTypeColors";

function CustomerList({ customers, handleCustomerClick, handleContextMenu }) {
  if (customers.length === 0) {
    return <p className="mb-1 mt-3">일치하는 고객이 없습니다.</p>;
  }

  return (
    <>
      <div class="flex justify-center">
        <div class="mx-11 mb-1 mt-3.5 flex  select-none justify-center">
          <div className="listItemTitleStyle listItem1">DB 분배일</div>
          <div className="listItemTitleStyle listItem2">고객유형</div>
          <div className="listItemTitleStyle listItem3">이름</div>
          <div className="listItemTitleStyle listItem4">나이</div>
          <div className="listItemTitleStyle listItem5">연락처</div>
          <div className="listItemTitleStyle listItem6">거주지</div>
          <div className="listItemTitleStyle listItem7">인수상태</div>
        </div>
      </div>
      {customers
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((customer) => (
          <div
            key={customer.pk}
            data-id={customer.pk}
            onContextMenu={(e) => handleContextMenu(e, customer)}
            className="list-group-item-container mx-11 flex justify-center"
          >
            <ListGroup
              className="flex justify-center"
              key={customer.pk}
              onClick={() => handleCustomerClick(customer)}
            >
              <ListGroup.Item
                className={`listItemStyle listItem1 ${
                  customer.contractYn
                    ? "listItemStyle-contract"
                    : "listItemStyle-noContract"
                }`}
              >
                {customer.registerDate}
              </ListGroup.Item>
              <ListGroup.Item
                className={` listItemStyle listItem2 ${
                  customer.contractYn
                    ? "listItemStyle-contract"
                    : "listItemStyle-noContract"
                }`}
                style={{ color: customerTypeColors[customer.customerType] }}
              >
                {customer.customerType}
              </ListGroup.Item>
              <ListGroup.Item
                className={`listItemStyle listItem3 ${
                  customer.contractYn
                    ? "listItemStyle-contract"
                    : "listItemStyle-noContract"
                }`}
              >
                {customer.name}
              </ListGroup.Item>
              <ListGroup.Item
                className={`listItemStyle listItem4 ${
                  customer.contractYn
                    ? "listItemStyle-contract"
                    : "listItemStyle-noContract"
                }`}
              >
                만 {customer.age}세
              </ListGroup.Item>
              <ListGroup.Item
                className={`listItemStyle listItem5 ${
                  customer.contractYn
                    ? "listItemStyle-contract"
                    : "listItemStyle-noContract"
                }`}
              >
                {customer.phone}
              </ListGroup.Item>
              <ListGroup.Item
                className={`listItemStyle listItem6 ${
                  customer.contractYn
                    ? "listItemStyle-contract"
                    : "listItemStyle-noContract"
                }`}
              >
                {customer.dongString}
                {customer.address}
              </ListGroup.Item>
              <ListGroup.Item
                className={`listItemStyle listItem7 ${
                  customer.contractYn
                    ? "listItemStyle-contract"
                    : "listItemStyle-noContract"
                }`}
              >
                {customer.state}
              </ListGroup.Item>
            </ListGroup>
          </div>
        ))}
    </>
  );
}

export default CustomerList;
