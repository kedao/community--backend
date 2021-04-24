import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/common/post`;

function setBoutique(postId) {
    return fetchWrapper.post(`${baseUrl}/setBoutique`, {
        postId
    });
}

function cancelBoutique(postId) {
    return fetchWrapper.post(`${baseUrl}/cancelBoutique`, {
        postId
    });
}

function setTop(postId) {
    return fetchWrapper.post(`${baseUrl}/setTop`, {
        postId
    });
}

function cancelTop(postId) {
    return fetchWrapper.post(`${baseUrl}/cancelTop`, {
        postId
    });
}

function del(id) {
    return fetchWrapper.postJson(`${baseUrl}/del`, {
        id
    });
}

export const post = {
    setBoutique,
    cancelBoutique,
    setTop,
    cancelTop,
    del,
};
