import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/article`;

function selectByPage(currentPage, perPage = 30, title = '') {
    return fetchWrapper.postJson(`${baseUrl}/selectByPage`, {
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

function selectToUpdate(id) {
    return fetchWrapper.get(`${baseUrl}/selectToUpdate`, {
        id
    });
}

function create(data) {
    return fetchWrapper.postJson(`${baseUrl}/create`, data);
}

function createVideo(data) {
    return fetchWrapper.postJson(`${baseUrl}/createVideo`, data);
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

const name = 'article';
const title = '文章';

export const articleAdmin = {
    name,
    title,
    selectByPage,
    selectById,
    selectToUpdate,
    create,
    createVideo,
    update,
    remove,
    hide,
    restore,
};
