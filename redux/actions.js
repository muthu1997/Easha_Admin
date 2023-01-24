import { STORE_ANALYTICS, STORE_CATEGORY, STORE_SIZE, STORE_CAT_PRODUCT, STORE_DELIVERY, STORE_COMPLETED_ORDER, STORE_PENDING_ORDER, STORE_ORDER_DETAILS, UPDATE_PROFILE_DATA, STORE_SHOP_LIST, STORE_MAIN_CATEGORY, STORE_SELLER_PRODUCT } from "./types";
import { getMethod, uploadImage, putMethod, postMethod, deleteMethod } from "../utils/function";

export const storeAnalytics = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`admin/analytics/${id}`).then(res => {
            dispatch({
                type: STORE_ANALYTICS,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const storeCategory = (pid) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`category/listbypid/${pid}`).then(res => {
            dispatch({
                type: STORE_CATEGORY,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const storeMainCategory = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod("maincategory/list").then(res => {
            dispatch({
                type: STORE_MAIN_CATEGORY,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const uploadImg = (image, name) => {
    return new Promise((resolve, reject) => {
        uploadImage(image, name).then(response => {
            return resolve(response);
        }).catch(error => {
            return reject(error);
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

export const deleteImageFromAWS = (id) => (dispatch) => {
    return new Promise(async (resolve, reject) => {
        let body = {
            key: id
        }
        putMethod(`images/aws`, body)
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
            console.log(url + " = " + JSON.stringify(error))
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
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const setDeliveryList = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod("delivery/list/all").then(res => {
            dispatch({
                type: STORE_DELIVERY,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const storePendingOrderList = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod("order/admin/pending").then(res => {
            dispatch({
                type: STORE_PENDING_ORDER,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const storeCompletedOrderList = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod("order/admin/delivered").then(res => {
            dispatch({
                type: STORE_COMPLETED_ORDER,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const storeOrderDetails = (order_id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`order/${order_id}`).then(res => {
            dispatch({
                type: STORE_ORDER_DETAILS,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const updateProfileData = (_id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`user/${_id}`).then(res => {
            dispatch({
                type: UPDATE_PROFILE_DATA,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const getShopList = (user_id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`shop/list/${user_id}`).then(res => {
            console.log(res.data)
            dispatch({
                type: STORE_SHOP_LIST,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const getConversationsByUser = (fromUser, toUser) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`chatlist/${toUser}/${fromUser}`).then(res => {
            console.log("res.data: ",res.data)
            if (res.data.length > 0) {
                dispatch({
                    type: "update_local_message",
                    payload: { message: res.data[0].messages, conversationId: toUser }
                })
            }
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        })
    })
}

export const storeSellerProduct = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        getMethod(`product/listbysellerid/${id}`).then(res => {
            dispatch({
                type: STORE_SELLER_PRODUCT,
                payload: res.data
            })
            return resolve(res.data);
        }).catch(err => {
            return reject(-1);
        })
    })
}