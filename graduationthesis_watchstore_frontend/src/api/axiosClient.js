import axios from 'axios';
import { parse, stringify } from 'qs';
import { toast } from 'react-toastify';
import apiConfig from './apiConfig';

const axiosClient = axios.create({
    baseURL: apiConfig.baseURL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Origin, X-Auth-Token, Authorization',
        token: `Bearer ${localStorage.getItem('mynhbake_token')}`,
    },
    paramsSerializer: {
        encode: parse,
        serialize: stringify,
    },
});

axiosClient.interceptors.request.use(
    async config => {
        const token = localStorage.getItem('mynhbake_token');
        if (token) {
            config.headers['token'] = `Bearer ${token}`;
        }
        return {
            ...config,
        };
    },
    error => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    function (response) {
        return response && response.data ? response.data : response;
    },
    function (error) {
        let status = error.response ? error.response.status : false;
        let msg = '';
        if (status) {
            msg = error.response.data.message;
        } else {
            msg = error.message;
        }
        toast.error(msg);
        return Promise.reject(error);
    }
);

export const Instagram = axios.create({
    baseURL: 'https://graph.instagram.com/',
});

Instagram.interceptors.request.use(async config => config);

Instagram.interceptors.response.use(
    response => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    error => {
        let status = error.response ? error.response.status : false;
        let msg = '';
        if (status) {
            msg = error.response.data.message;
        } else {
            msg = error.message;
        }
        toast.error(msg);

        return Promise.reject(error);
    }
);

export const GHN = axios.create({
    baseURL: 'https://online-gateway.ghn.vn/shiip/public-api/',
    headers: {
        'Content-Type': 'application/json',
        Token: process.env.REACT_APP_TOKEN_GHN,
        ShopId: process.env.REACT_APP_SHOPID,
    },
});

GHN.interceptors.request.use(async config => config);

GHN.interceptors.response.use(
    response => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    error => {
        let status = error.response ? error.response.status : false;
        let msg = '';
        if (status) {
            msg = error.response.data.message;
        } else {
            msg = error.message;
        }
        toast.error(msg);

        return Promise.reject(error);
    }
);

export default axiosClient;
