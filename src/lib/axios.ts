import axios from 'axios';

import { PUBLIC_SITE_URL } from '$env/static/public';

axios.defaults.baseURL = PUBLIC_SITE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use((request) => {
    return request;
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 何らかの処理が可能
        if (!error || !error.response) {
            return Promise.reject(error);
        }

        if (error.response.status == 401) {
            //
        } else if (error.response.status == 403) {
            //
        }
        return Promise.reject(error);
    },
);
export default axios;
