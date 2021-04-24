import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/community`;

export const community = {
    selectByPage,
    selectById,
    selectSelectItems,
    create,
    update,
    remove,
};

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
