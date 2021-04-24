import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/reportHistory`;

function selectByPage(currentPage, perPage = 30, data = '') {
    return fetchWrapper.post(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        ...data,
    });
}

const name = 'reportHistory';
const title = '举报历史';

export const reportHistory = {
    name,
    title,
    selectByPage,
};
