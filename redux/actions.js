import { STORE_ANALYTICS, STORE_CATEGORY, STORE_SIZE, STORE_CAT_PRODUCT } from "./types";
import { getMethod, uploadImage, putMethod, postMethod } from "../utils/function";

export const storeAnalytics = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod("admin/analytics").then(res => {
            dispatch({
                type: STORE_ANALYTICS,
                payload: res.data
            })
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })
}

export const storeCategory = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod("category/list").then(res => {
            dispatch({
                type: STORE_CATEGORY,
                payload: res.data
            })
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })
}

export const uploadImg = (image, name) => {
    return new Promise((resolve, reject) => {
        uploadImage(image, name).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export const updateMethod = (url, body) => (dispatch) => {
    return new Promise(async (resolve, reject) => {
        putMethod(url, body)
            .then(response => {
                return resolve(response);
            }).catch(error => {
                return reject(error)
            })
    })
}

export const postMethodFunction = (url, body) => (dispatch) => {
    console.log(body)
    return new Promise(async (resolve, reject) => {
        postMethod(url, body).then(response => {
            console.log(response)
                return resolve(response);
            }).catch(error => {
                console.log(error)
                return reject(error)
            })
    })
}

export const storeCategoryProduct = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`product/listbycatid/${id}`).then(res => {
            dispatch({
                type: STORE_CAT_PRODUCT,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(-1);
        })
    })
}

export const storeSizeList = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod("size/list").then(res => {
            dispatch({
                type: STORE_SIZE,
                payload: res.data
            })
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })
}