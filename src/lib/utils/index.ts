import { AuthApiError } from '@supabase/supabase-js';
import { AxiosError } from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { ZodError } from 'zod';

import { ERROR_MESSAGE } from '$lib/consts/errorMessage';
import { danger } from '$lib/utils/notification';

// 端末判定
export const deviceCheck = function () {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let result;

    if (userAgent.includes('iphone')) {
        result = 'iphone';
    } else if (userAgent.includes('ipad')) {
        result = 'ipad';
    } else if (userAgent.includes('android')) {
        if (userAgent.includes('mobile')) {
            result = 'android';
        } else {
            result = 'android_tablet';
        }
    } else if (userAgent.includes('mac os x')) {
        result = 'mac';
    } else {
        result = 'windows';
    }
    return result;
};

// ブラウザ判定
export const browserCheck = function () {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let result = '';
    let resultVer: string | number = '';

    if (userAgent.includes('msie') || userAgent.includes('trident')) {
        result = 'ie';
    } else if (userAgent.includes('edge')) {
        result = 'edge';
    } else if (userAgent.includes('chrome')) {
        result = 'chrome';
    } else if (userAgent.includes('safari')) {
        result = 'sfari';
    } else if (userAgent.includes('firefox')) {
        result = 'firefox';
    } else if (userAgent.includes('opera')) {
        result = 'opera';
    } else {
        result = 'other';
    }

    // IEの場合はversionも追加する
    if (result === 'ie') {
        // IE対応なのでappVersionは非推奨でも実施
        const version = window.navigator.appVersion.toLowerCase();
        if (userAgent.includes('trident')) {
            resultVer = 11;
        } else if (version.includes('msie 10.')) {
            resultVer = 10;
        } else if (version.includes('msie 9.')) {
            resultVer = 9;
        } else if (version.includes('msie 8.')) {
            resultVer = 8;
        } else if (version.includes('msie 7.')) {
            resultVer = 7;
        } else if (version.includes('msie 6.')) {
            resultVer = 6;
        } else {
            resultVer = 'unknown';
        }
    }
    return result + resultVer;
};

export const getCookies = () => {
    if (!navigator.cookieEnabled || !document.cookie) {
        return {};
    }

    return document.cookie.split('; ').reduce((prev, current) => {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
    }, {} as { [key: string]: string });
};

// システムカラー取得
export const getSystemColor = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)');
    return isDark ? 'dark' : 'light';
};

export const getCookieColor = () => {
    if (!navigator.cookieEnabled) {
        return 'light';
    }

    const cookie = getCookies();
    return cookie.theme ?? 'light';
};

export const setCookieColor = (color: string) => {
    if (!navigator.cookieEnabled) {
        document.body.dataset.theme = getSystemColor();
        return;
    }

    document.cookie = `theme=${color}`;
};

export const sleep = (time: number, callback: null | (() => void) = null) => {
    if (callback) {
        return new Promise((resolve) => {
            setTimeout(function () {
                resolve(callback());
            }, time * 1000);
        });
    } else {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
};

export const emptyString2Delete = (obj: { [key: string]: unknown }) => {
    const copyObj = cloneDeep(obj);
    Object.keys(copyObj).forEach(key => {
        if (copyObj[key] === '') {
            delete copyObj[key];
        }
    });
    return copyObj;
};

export const errorHandling = (error: unknown) => {
    try {
        if (error instanceof ZodError) {
            const errors = Array.from(
                new Set(error.issues.map((err) => err.message)),
            );
            errors.forEach((err) => {
                danger(err);
            });
        } else if (error instanceof AuthApiError) {
            console.error(error);
            danger(ERROR_MESSAGE.UNKNOWN);
        } else if (error instanceof AxiosError) {
            error.response?.data.errors.forEach(error => {
                danger(error.message);
            });
        } else if (typeof error === 'string') {
            danger(error);
        } else {
            console.error(error);
            danger(ERROR_MESSAGE.UNKNOWN);
        }

    } catch (error) {
        danger(ERROR_MESSAGE.UNKNOWN);
    }
};

// ファイルオブジェクトはブラウザのみ
export const getImageFormat = async (file: File | string) => {
    let arrayBuffer;
    if (typeof file === 'object') {
        // file
        arrayBuffer = await file.arrayBuffer();
    } else if (typeof file === 'string') {
        // base64
        const blob = atob(file.replace(/^.*,/, ''));
        arrayBuffer = new Uint8Array(blob.length);
        for (let i = 0; i < blob.length; i++) {
            arrayBuffer[i] = blob.charCodeAt(i);
        }
    } else {
        return null;
    }

    const arr = new Uint8Array(arrayBuffer).subarray(0, 4);
    let header = '';
    for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
    }

    switch (true) {
        case /^52494646/.test(header):
            return 'image/webp';
        case /^89504e47/.test(header):
            return 'image/png';
        case /^47494638/.test(header):
            return 'image/gif';
        case /^ffd8ff/.test(header):
            return 'image/jpeg';
        default:
            return null;
    }
};

export const file2Base64 = file => new Promise<string>((resolve, reject) => {
    if (!file) { resolve(null); }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64String = (reader.result as string)
            .replace('data:', '')
            .replace(/^.+,/, '');
        resolve(base64String);
    };
    reader.onerror = error => reject(error);
});

export const file2dataUri = file => new Promise<string>((resolve, reject) => {
    if (!file) { resolve(null); }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        resolve(reader.result as string);
    };
    reader.onerror = error => reject(error);
});

export const base642Blob = (base64: string, type: string) => {
    let bin;
    let arrayBuffer;
    if (typeof window !== 'undefined') {
        // ブラウザ
        bin = window.atob(base64.replace(/^.*,/, ''));
        const buffer = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        arrayBuffer = buffer.buffer;
    } else {
        // サーバー
        arrayBuffer = Buffer.from(base64.replace(/^.*,/, ''), 'base64');
    }

    const blob = new Blob([arrayBuffer], { type });
    return blob;
};

// browser専用
export const base642File = async (base64: string, fileName: string): Promise<File | null> => {
    if (!base64) { return null; }

    let type = await getImageFormat(base64);

    if (!type) { return null; }

    const blob = base642Blob(base64, type);

    type = type.split('/')[1];

    return new File([blob], fileName, { type });
};

export const createShortId = () => {
    const uuid = crypto.randomUUID();
    const hexArray: number[] = uuid.split('-').join('').split('', 16).map((hex: string) => parseInt(hex, 16));
    const shortId = Buffer.from(hexArray).toString('base64').replace('==', '').replace('/', '').replace('+', '');
    return shortId;
};
