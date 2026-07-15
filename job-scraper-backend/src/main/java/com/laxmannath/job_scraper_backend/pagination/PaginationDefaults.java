package com.laxmannath.job_scraper_backend.pagination;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class PaginationDefaults {

    @Value("${pagination.default-page-size}")
    private int defaultPageSize;

    @Value("${pagination.max-page-size}")
    private int maxPageSize;

    @Value("${pagination.default-sort-parameter}")
    private String defaultSortParameter;

    @Value("${pagination.default-sorting-order}")
    private String defaultSortingOrder;

    public Pagination applyDefaults(Pagination pagination) {
        if (pagination.getPageNo() <= 0) {
            pagination.setPageNo(1);
        }

        if (pagination.getPageSize() <= 0) {
            pagination.setPageSize(defaultPageSize);
        } else if (pagination.getPageSize() > maxPageSize) {
            pagination.setPageSize(maxPageSize);
        }

        if (!StringUtils.hasText(pagination.getSortParameter())) {
            pagination.setSortParameter(defaultSortParameter);
        }

        if (!StringUtils.hasText(pagination.getSortingOrder())) {
            pagination.setSortingOrder(defaultSortingOrder);
        }

        return pagination;
    }
}
