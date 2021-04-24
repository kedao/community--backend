import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/productCategory`;

function selectByPage(currentPage, perPage = 30, title = '', pid) {
    return fetchWrapper.post(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        title,
        pid,
    });
}

function selectById(id) {
    return fetchWrapper.get(`${baseUrl}/selectById`, {
        id
    });
}

function selectSelectItems(pid) {
    return fetchWrapper.get(`${baseUrl}/selectSelectItems`, {
        pid
    });
}

function create(data) {
    return fetchWrapper.postJson(`${baseUrl}/create`, data);
}

function update(data) {
    return fetchWrapper.postJson(`${baseUrl}/update`, data);
}

function remove(ids) {
    return fetchWrapper.postJson(`${baseUrl}/delete`, {idList: ids});
}

const name = 'productCategory';
const title = '产品类目';

export const productCategory = {
    name,
    title,
    selectByPage,
    selectSelectItems,
    selectById,
    create,
    update,
    remove,
};
