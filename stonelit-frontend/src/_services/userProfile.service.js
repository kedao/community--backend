import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/userProfile`;

function myArticleInfo(queryType, currentPage, perPage = 30) {
    return fetchWrapper.get(`${baseUrl}/myArticleInfo`, {
        pageNum: currentPage,
        pageSize: perPage,
        auditState: null,
        queryType,
    });
}

function myBaseInfo() {
    return fetchWrapper.get(`${baseUrl}/myBaseInfo`);
}

export const userProfile = {
    myArticleInfo,
    myBaseInfo,
};
