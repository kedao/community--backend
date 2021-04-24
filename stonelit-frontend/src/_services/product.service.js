import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/product`;

function selectByPage(currentPage, perPage = 30, params = {}) {
    return fetchWrapper.postJson(`${baseUrl}/selectByPage`, {
        ...params,
        pageNum: currentPage,
        pageSize: perPage,
    });
}

function selectById(id) {
    return fetchWrapper.get(`${baseUrl}/selectById`, {
        id
    });
}

function selectToUpdate(id) {
    return fetchWrapper.get(`${baseUrl}/selectToUpdate`, {
        id
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

function hide(id) {
    return fetchWrapper.post(`${baseUrl}/hide`, {
        productId: id
    });
}

function restore(id) {
    return fetchWrapper.post(`${baseUrl}/restore`, {
        productId: id
    });
}

const name = 'product';
const title = '产品';
const ONLINE_STATUS = 0; // 商品正常状态
const OFFLINE_STATUS = 1; // 商品隐藏状态

export const product = {
    name,
    title,
    ONLINE_STATUS,
    OFFLINE_STATUS,
    selectByPage,
    selectById,
    selectToUpdate,
    create,
    update,
    remove,
    hide,
    restore,
};
