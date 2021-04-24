import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/productParamSetting`;

function selectByPage(currentPage, perPage = 30, paramName = '', enableAll = null) {
    return fetchWrapper.post(`${baseUrl}/selectByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        paramName,
        enableAll,
    });
}

function selectById(id) {
    return fetchWrapper.get(`${baseUrl}/selectById`, {
        id
    });
}

function selectSelectItems(enableAll) {
    return fetchWrapper.get(`${baseUrl}/selectSelectItems`, {
        enableAll,
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

const name = 'productParamSetting';
const title = '产品参数库';

export const productParamSetting = {
    name,
    title,
    selectByPage,
    selectSelectItems,
    selectById,
    create,
    update,
    remove,
};
