import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/communityCategory`;

function selectByPage(currentPage, perPage = 30, title = '') {
    return fetchWrapper.post(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        title,
    });
}

function selectById(id) {
    return fetchWrapper.get(`${baseUrl}/selectById`, {
        id
    });
}

function selectSelectItems() {
    return fetchWrapper.get(`${baseUrl}/selectSelectItems`);
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

export const communityCategory = {
    selectByPage,
    selectById,
    selectSelectItems,
    create,
    update,
    remove,
};
