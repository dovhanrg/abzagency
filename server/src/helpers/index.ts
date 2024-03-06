import {DEFAULT_COUNT_PARAM} from "../router/getUsers";
import {api_url} from "../consts";

export const getTotalPages = (totalUsers: number, count?: string) => {
    return {
        totalPages: Math.ceil(totalUsers / (Number.isNaN((Number(count))) ? DEFAULT_COUNT_PARAM : Number(count))) - 1,
        remainder: totalUsers % (Number.isNaN((Number(count))) ? DEFAULT_COUNT_PARAM : Number(count)),
    };
}

export const getNextPageUrl = (totalUsers: number, currentPage?: string, count?: string) => {
    const page = Number.isNaN(Number(currentPage)) ? 1 : Number(currentPage);
    console.log(getTotalPages(totalUsers, count), page);

    const {totalPages, remainder} = getTotalPages(totalUsers, count);
    return totalPages > page + 1 || totalPages === page + 1 && remainder !== 0
        ? `${api_url}/api/v1/users?page=${page + 1}&count=${count ?? DEFAULT_COUNT_PARAM}`
        : null;
}

export const getPrevPageUrl = (currentPage?: string, count?: string) => {
    const page = Number.isNaN(Number(currentPage)) ? 1 : Number(currentPage);
    return (page - 1) < 0
        ? null
        : `${api_url}/api/v1/users?page=${page - 1}&count=${count ?? DEFAULT_COUNT_PARAM}`
}

export const getPhotoSrc = (photoId: string) => {
    return `/static/${photoId}.jpg`;
}