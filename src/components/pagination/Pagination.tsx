import React, {useEffect, useState} from 'react';
import css from './Pagination.module.css';

interface PaginationProps {
    pagesCount: number;
    currentPage: number;
    paginate: (pageNumber: number) => void;
    minPrice: number;
    maxPrice: number;
    selectedFilter?: string | null;
    onChange: (pageNumber: React.SetStateAction<number>) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagesCount, currentPage, paginate, minPrice, maxPrice, selectedFilter, onChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= pagesCount; i++) {
        pageNumbers.push(i);
    }

    const [maxPageButtons] = useState(5);
    const [currentPageGroup, setCurrentPageGroup] = useState(1);

    const currentGroupFirstPage = (currentPageGroup - 1) * maxPageButtons + 1;
    const currentGroupLastPage = currentPageGroup * maxPageButtons;

    const displayPageNumbers = pageNumbers.filter(
        (pageNumber) => pageNumber >= currentGroupFirstPage && pageNumber <= currentGroupLastPage
    );

    useEffect(() => {
        onChange(1);
    }, [minPrice, maxPrice, selectedFilter]);

    const prevPage = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    }

    const nextPage = () => {
        if (currentPage < pagesCount) {
            paginate(currentPage + 1);
        }
    }
    return (
        <div className={css.pagination}>
            <ul>
                <a onClick={prevPage}>
                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 2.28571L3.375 8L9 13.7143L7.875 16L2.54292e-07 8L7.875 9.83506e-08L9 2.28571Z" fill="#FFC85E"/>
                    </svg>

                </a>
                {currentPageGroup > 1 && (
                    <li onClick={() => setCurrentPageGroup(currentPageGroup - 1)}>
                        <a href="#" >Previous</a>
                    </li>
                )}

                {displayPageNumbers.map((number) => (
                    <li key={number} className={currentPage === number ? css.active : ''}>
                        <a onClick={() => paginate(number)}>
                            {number}
                        </a>
                    </li>
                ))}

                {currentPageGroup < Math.ceil(pagesCount / maxPageButtons) && (
                    <li onClick={() => setCurrentPageGroup(currentPageGroup + 1)}>
                        <a href="#">Next</a>
                    </li>
                )}
                <a onClick={nextPage}>
                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 13.7143L5.625 8L0 2.28571L1.125 0L9 8L1.125 16L0 13.7143Z" fill="#FFC85E"/>
                </svg>
                </a>
            </ul>
        </div>
    );
};

export default Pagination;