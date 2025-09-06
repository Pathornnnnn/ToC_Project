import React, { useState } from "react";

function Pagination({ totalPages, currentPage, onPageChange }) {
  const maxPageNumbersToShow = 5; // แสดงเลขหน้า 5 หน้าแรกเสมอ

  const handleClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // สร้างเลขหน้าที่จะแสดง
  const pageNumbers = [];

  if (totalPages <= maxPageNumbersToShow + 2) {
    // แสดงเลขหน้าทั้งหมด ถ้าจำนวนน้อยพอ
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // แสดง 5 หน้าแรก, ..., หน้า last
    for (let i = 1; i <= maxPageNumbersToShow; i++) {
      pageNumbers.push(i);
    }
    pageNumbers.push("ellipsis");
    pageNumbers.push(totalPages);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4 text-white font-mono">
      {/* เลขหน้า */}
      {pageNumbers.map((page, idx) =>
        page === "ellipsis" ? (
          <span key={idx} className="select-none">
            .....
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handleClick(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-cyan-600 font-bold"
                : "hover:bg-cyan-400"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* ปุ่ม Next */}
      <button
        onClick={() => {
          if (currentPage < totalPages) onPageChange(currentPage + 1);
        }}
        disabled={currentPage === totalPages}
        className={`ml-4 px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-cyan-500 hover:bg-cyan-600"
        }`}
      >
        NEXT &gt;&gt;
      </button>
    </div>
  );
}

export default Pagination;
