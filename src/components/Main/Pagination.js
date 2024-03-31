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

  ////////////  기존 페이지네이션 로직
  //    // '다음' 버튼 클릭 핸들러
  //    const handleNextClick = () => {
  //     const maxPage = Math.ceil(customers.length / customersPerPage);
  //     if (currentPage < maxPage) {
  //       const nextPage = Math.min(
  //         maxPage,
  //         currentPage + (5 - ((currentPage - 1) % 5)),
  //       );
  //       setCurrentPage(nextPage);
  //     }
  //   };

  //   // '이전' 버튼 클릭 핸들러
  //   const handlePrevClick = () => {
  //     if (currentPage > 1) {
  //       // 현재 페이지 그룹의 첫 페이지를 계산 (5로 나눈 뒤 내림한 값에 5를 곱하고 1을 더함)
  //       const currentGroupStartPage = Math.floor((currentPage - 1) / 5) * 5 + 1;

  //       // 바로 이전 페이지 그룹의 첫 페이지를 찾기 위해 현재 그룹의 첫 페이지에서 5를 빼줌
  //       const newPage = currentGroupStartPage - 5;

  //       // 새 페이지가 1보다 작으면 1로 설정, 아니면 새 페이지 번호로 설정
  //       setCurrentPage(newPage < 1 ? 1 : newPage);
  //     }
  //   };
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
