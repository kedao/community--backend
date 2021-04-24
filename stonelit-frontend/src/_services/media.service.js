import config from 'config';
import axios from "axios";
import { handleResponse, authHeader } from '@/_helpers/fetch-wrapper';

const baseUrl = `${config.apiUrl}/smart/api/common/file`;
// const baseUrl = 'http://localhost/dev';

const http = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-type": "application/json"
    }
});

export const media = {
    uploadImage,
    uploadVideo,
};

function uploadImage(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/uploadImage", formData, {
        headers: {'Content-Type':'application/x-www-form-urlencoded', ...authHeader("/uploadImage") },
        onUploadProgress,
    }).then(handleResponseResource);
}

function uploadVideo(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/uploadVideo", formData, {
        headers: {'Content-Type':'application/x-www-form-urlencoded', ...authHeader("/uploadVideo") },
        onUploadProgress,
    }).then(handleResponseResource);
}

function handleResponseResource(response) {
    const data = response.data;

    return handleResponse(response, data);
}
