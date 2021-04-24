import config from 'config';
import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/smart/api/public`;

function loginByPassword(username, password) {
    return fetchWrapper.post(`${baseUrl}/loginByPassword`, {
        username,
        password,
    });
}

const name = 'login';
const title = '用户';

export const login = {
    name,
    title,
    loginByPassword,
};

