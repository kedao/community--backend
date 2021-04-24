import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/auditHistory`;

function selectByPage(currentPage, perPage = 30) {
    return fetchWrapper.post(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        queryType: 9,
    });
}

const name = 'auditHistory';
const title = '投稿审核记录';

export const auditHistoryService = {
    name,
    title,
    selectByPage,
};
