import { STORE_ANALYTICS, STORE_CATEGORY, STORE_CAT_PRODUCT, STORE_SIZE } from "./types";

const mainStore = {
    analytics: [],
    categoryList: [],
    catProductList: [],
    productSize: []
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
        default:
            return state
    }
}