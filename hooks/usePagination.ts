import { useState } from 'react';

function usePagination(initialPage: number = 1) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return { currentPage, goToPage };
}

export default usePagination;
