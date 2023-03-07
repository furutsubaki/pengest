
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

interface Session {
    access_token: string;
    refresh_token: string;
}

const authAxios = (session: Session | null) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!session) {
        throw new Error('セッション情報がありません');
    }

    axios.defaults.headers.common.access_token = session.access_token;
    axios.defaults.headers.common.refresh_token = session.refresh_token;

    return {
        get: <T = any, R = AxiosResponse<T>, D = any>(url: string, options?: AxiosRequestConfig<D>): Promise<R> => {
            return axios.get(url, options);
        },
        post: <T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, options?: AxiosRequestConfig<D>): Promise<R> => {
            return axios.post(url, data, options);
        },
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
};
export default authAxios;
