import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/userFeedback`;

function selectByPage(currentPage, perPage = 30, data = '') {
    return fetchWrapper.post(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        ...data,
    });
}

const name = 'userFeedback';
const title = '用户反馈';

export const userFeedback = {
    name,
    title,
    selectByPage,
};
