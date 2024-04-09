import React from "react";

const Pagination = ({
  currentPage,
  customersLength,
  customersPerPage,
  onPageChange,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(customersLength / customersPerPage); i++) {
    pageNumbers.push(i);
  }
  const startPage = 1 + 5 * Math.floor((currentPage - 1) / 5);
  const endPage = Math.min(startPage + 4, pageNumbers.length);

  ////////////  새로운 페이지네이션 로직
  const handlePrevClick = () => {
    const newPage = Math.max(1, startPage - 5);
    onPageChange(newPage);
  };

  const handleNextClick = () => {
    const maxPage = pageNumbers.length;
    const nextPage = Math.min(maxPage, endPage + 1);
    onPageChange(nextPage);
  };

  return (
    <div className="pageNation_Btn">
      <button onClick={handlePrevClick} disabled={currentPage === 1}>
        〈
      </button>
      {pageNumbers.slice(startPage - 1, endPage).map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          style={{
            backgroundColor:
              currentPage === number
                ? "var(--LightMode-Subtext)"
                : "transparent",
            fontSize: currentPage === number ? "12px" : "10px",
            fontWeight: "600",
            color: currentPage === number ? "#fff" : "var(--LightMode-Subtext)",
          }}
        >
          {number}
        </button>
      ))}
      <button
        onClick={handleNextClick}
        disabled={currentPage === pageNumbers.length}
      >
        〉
      </button>
    </div>
  );
};

export default Pagination;
