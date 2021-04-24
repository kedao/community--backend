import queryString from 'query-string';
import { accountService } from '@/_services';

export const fetchWrapper = {
    get,
    post,
    postJson,
    put,
    delete: _delete
}

function synthesis(url, query) {
    const str = queryString.stringify(query);
    if (str) {
        url = url + (url.indexOf('?') !== -1 ? '' : '?') + str;
    }

    return url;
}

function get(url, query) {
    url = synthesis(url, query);

    const requestOptions = {
        method: 'GET',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponseResource);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded', ...authHeader(url) },
        // credentials: 'include',
        body: queryString.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponseResource);
}

function postJson(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'accept': '*/*', 'Content-Type': 'application/json', ...authHeader(url) },
        // credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponseResource);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponseResource);    
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponseResource);
}

// helper functions

export function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = accountService.userValue;
    const isLoggedIn = user && user.accessToken;
    // const isApiUrl = url.startsWith(config.apiUrl);
    const isApiUrl = true;
    if (isLoggedIn && isApiUrl) {
        return { Authorization: user.accessToken };
    } else {
        return {};
    }
}

function handleResponseResource(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        return handleResponse(response, data);
    });
}

export function handleResponse(response, data) {
    if (response.status !== 200) {
        if ([401, 403].includes(response.status) && accountService.userValue) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            accountService.logout();
        }

        const error = (data && data.msg) || response.statusText;
        return Promise.reject(error);
    }

    if (!data || data.code !== 0) {
        return Promise.reject(data?.msg);
    }

    return data;
}
