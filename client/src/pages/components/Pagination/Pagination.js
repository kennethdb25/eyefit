/* eslint-disable no-unused-vars */
import { useState } from "react";

export const Pagination = ({ data }) => {
    let count = 0;
    for (var keys in data) {
        if (data.hasOwnProperty(keys)) {
            count++
        }
    }
    const [paginationCount, setPaginationCount] = useState({
        defaultCurrent: 1,
        pageSize: 10,
        total: count,
    });

    return paginationCount;
}