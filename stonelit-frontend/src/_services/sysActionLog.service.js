import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/sysActionLog`;

function selectByPage(currentPage, perPage = 30, data = {}) {
    return fetchWrapper.postJson(`${baseUrl}/selectByPage`, {
        ...data,
        pageNum: currentPage,
        pageSize: perPage,
    });
}

const name = 'sysActionLog';
const title = '记录';

export const sysActionLog = {
    name,
    title,
    selectByPage,
};
