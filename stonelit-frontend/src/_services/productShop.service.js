import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/productShop`;

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

function selectSelectItems(id) {
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

const name = 'productShop';
const title = '产品商城';

export const productShop = {
    name,
    title,
    selectByPage,
    selectSelectItems,
    selectById,
    create,
    update,
    remove,
};
