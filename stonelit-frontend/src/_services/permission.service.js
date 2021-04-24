import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/pc/permission`;

function selectAllPermit() {
    return fetchWrapper.get(`${baseUrl}/selectAllPermit`);
}

function selectMyAdminPermit() {
    return fetchWrapper.get(`${baseUrl}/selectMyAdminPermit`);
}

function selectUserWithPermitByPage(currentPage, perPage = 30, userId, nickName, permitCode) {
    return fetchWrapper.postJson(`${baseUrl}/selectUserWithPermitByPage`, {
        pageNum: currentPage,
        pageSize: perPage,
        idList: userId ? [userId] : null,
        nickName,
        permitCode,
    });
}

function updateUserAdminPermit(permits) {
    return fetchWrapper.postJson(`${baseUrl}/updateUserAdminPermit`, permits);
}

const name = 'permission';
const title = '权限管理';

export const permission = {
    name,
    title,
    selectAllPermit,
    selectMyAdminPermit,
    selectUserWithPermitByPage,
    updateUserAdminPermit,
};
