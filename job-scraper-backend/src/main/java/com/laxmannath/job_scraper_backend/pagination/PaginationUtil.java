package com.laxmannath.job_scraper_backend.pagination;


import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationUtil {

    public static Pageable performPagination(int pageNo, int pageSize) {
        return PageRequest.of(pageNo - 1, pageSize);
    }

    public static Pageable performPagination(int pageNo, int pageSize, String sortingOrder, String sortParameter) {
        if (sortingOrder.equalsIgnoreCase("ascending"))
            return PageRequest.of(pageNo - 1, pageSize, Sort.by(sortParameter).ascending());
        return PageRequest.of(pageNo - 1, pageSize, Sort.by(sortParameter).descending());
    }

    public static Pageable performPagination(Pagination pagination) {
        return PaginationUtil.performPagination(pagination.getPageNo(), pagination.getPageSize(),
                pagination.getSortingOrder(), pagination.getSortParameter());
    }
}
