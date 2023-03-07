import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getCookie = (id: string) => {
    return cookies.get(id);
};

export const getCookieALl = () => {
    return cookies.getAll();
};

export const setCookie = (id: string, value: string) => {
    cookies.set(id, value);
};
