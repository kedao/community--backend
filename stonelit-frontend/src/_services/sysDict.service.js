import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/sysDict`;

function selectByPage(currentPage, perPage = 30) {
    return fetchWrapper.post(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
    });
}

function selectById(id) {
    return fetchWrapper.get(`${baseUrl}/selectById`, {
        id
    });
}

function create(data) {
    return fetchWrapper.post(`${baseUrl}/create`, data);
}

function update(data) {
    return fetchWrapper.post(`${baseUrl}/update`, data);
}

function remove(ids) {
    return fetchWrapper.postJson(`${baseUrl}/delete`, {idList: ids});
}

const name = 'sysDict';
const title = '数据字典';

export const sysDict = {
    name,
    title,
    selectByPage,
    selectById,
    create,
    update,
    remove,
};
