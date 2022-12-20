import { STORE_ANALYTICS, STORE_CATEGORY, STORE_CAT_PRODUCT, STORE_SIZE, STORE_DELIVERY, STORE_COMPLETED_ORDER, STORE_PENDING_ORDER, STORE_ORDER_DETAILS, UPDATE_PROFILE_DATA } from "./types";

const mainStore = {
    analytics: [],
    categoryList: [],
    catProductList: [],
    deliveryList: [],
    productSize: [],
    pendingOrderList: [],
    completedOrderList: [],
    orderDetails: {},
    profile: {},
    apiHeaders: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
    }
}

export default function mtoreManager(state = mainStore, action) {
    switch (action.type) {
        case STORE_ANALYTICS:
            return { ...state, analytics: action.payload }
        case STORE_CATEGORY:
            return { ...state, categoryList: action.payload }
        case STORE_CAT_PRODUCT:
            return { ...state, catProductList: action.payload }
        case STORE_SIZE:
            return { ...state, productSize: action.payload }
        case STORE_DELIVERY:
            return { ...state, deliveryList: action.payload }
        case STORE_PENDING_ORDER:
            return { ...state, pendingOrderList: action.payload }
        case STORE_COMPLETED_ORDER:
            return { ...state, completedOrderList: action.payload }
        case STORE_ORDER_DETAILS:
            return { ...state, orderDetails: action.payload }
        case UPDATE_PROFILE_DATA:
            return {
                ...state,
                profile: action.payload
            };
        default:
            return state
    }
}