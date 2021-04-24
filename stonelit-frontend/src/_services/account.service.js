import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper, history } from '@/_helpers';
import { permissions } from '@/_helpers/role';

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/accounts`;

export const accountService = {
    loginByPassword,
    logout,
    refreshToken,
    refreshProfile,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    get hasBackendRight () {
        const permits = userSubject && userSubject.value && userSubject.value.permissions && userSubject.value.permissions.permits ? userSubject.value.permissions.permits : {};

        // const permits = userSubject?.value?.permissions?.permits ?? {};
        let hasRight = false;

        for (let key of Object.values(permissions)) {
            if (permits[key] === 1) {
                hasRight = true;
                break;
            }
        }

        return hasRight;
    },
    checkRight (permit) {
        const permits = userSubject && userSubject.value && userSubject.value.permissions && userSubject.value.permissions.permits ? userSubject.value.permissions.permits : {};

        return permits[permit] === 1;
    }
};


function loginByPassword(username, password) {
    return fetchWrapper.post(`${config.apiUrl}/smart/api/public/loginByPassword`, { username, password })
        .then(user => {
            localStorage.setItem('auth', JSON.stringify(user.data));

            // publish user to subscribers and start timer to refresh token
            userSubject.next(user.data);
            console.info('userSubject', userSubject.value);

            startRefreshTokenTimer();
            return user;
        });
}

function logout() {
    // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
    // fetchWrapper.post(`${baseUrl}/revoke-token`, {});
    // stopRefreshTokenTimer();

    localStorage.removeItem('auth');

    userSubject.next(null);
    history.push('/');
}

function refreshToken() {
    let user = localStorage.getItem('auth');
    if (user) {
        user = JSON.parse(user);
        userSubject.next(user);

        return user;
    }
    console.info(user);

    return;
    console.info('refreshToken', userSubject);

    return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            userSubject.next(user);
            startRefreshTokenTimer();
            return user;
        });
}

function refreshProfile() {
    if (!userSubject.value) {
        return;
    }

    return fetchWrapper.post(`${config.apiUrl}/smart/api/public/queryUserInfoByToken`, {token: userSubject.value.accessToken})
        .then(user => {
            localStorage.setItem('auth', JSON.stringify(user.data));

            userSubject.next(user.data);
            return user;
        });
}

function register(params) {
    return fetchWrapper.post(`${baseUrl}/register`, params);
}

function verifyEmail(token) {
    return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

function forgotPassword(email) {
    return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

function validateResetToken(token) {
    return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}

function resetPassword({ token, password, confirmPassword }) {
    return fetchWrapper.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(user => {
            // update stored user if the logged in user updated their own record
            if (user.id === userSubject.value.id) {
                // publish updated user to subscribers
                user = { ...userSubject.value, ...user };
                userSubject.next(user);
            }
            return user;
        });
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
        .then(x => {
            // auto logout if the logged in user deleted their own record
            if (id === userSubject.value.id) {
                logout();
            }
            return x;
        });
}

// helper functions

let refreshTokenTimeout;

function startRefreshTokenTimer() {
    let cat = localStorage.getItem('auth');
    console.info(cat);


    console.info(userSubject)

    return;
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}
