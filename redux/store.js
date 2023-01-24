import { STORE_ANALYTICS, STORE_CATEGORY, STORE_CAT_PRODUCT, STORE_SIZE, STORE_DELIVERY, STORE_COMPLETED_ORDER, STORE_PENDING_ORDER, STORE_ORDER_DETAILS, UPDATE_PROFILE_DATA, STORE_SHOP_LIST, STORE_MAIN_CATEGORY, STORE_SELLER_PRODUCT } from "./types";

const mainStore = {
    analytics: [],
    categoryList: [],
    catProductList: [],
    mainCategoryList: [],
    deliveryList: [],
    productSize: [],
    pendingOrderList: [],
    completedOrderList: [],
    orderDetails: {},
    profile: {},
    apiHeaders: {
        'Content-Type': 'application/json',
        "Accept": "application/json"
    },
    shopList: [],
    messages: [],
    users_online: [],
    selfUser: {},
    conversations: {},
    seller_products: []
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
        case STORE_MAIN_CATEGORY:
            return { ...state, mainCategoryList: action.payload }
        case UPDATE_PROFILE_DATA:
            return {
                ...state,
                profile: action.payload
            };
        case STORE_SHOP_LIST:
            return { ...state, shopList: action.payload }
        case STORE_SELLER_PRODUCT:
            return { ...state, seller_products: action.payload }
        case "users_online":
            const conversations = { ...state.conversations };
            const usersOnline = action.data;
            for (let i = 0; i < usersOnline.length; i++) {
                const userId = usersOnline[i].userId;
                if (conversations[userId] === undefined) {
                    conversations[userId] = {
                        messages: [],
                        username: usersOnline[i].username
                    };
                }
            }
            return { ...state, usersOnline, conversations };
        case "private_message":
            const conversationId = action.data.conversationId;
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    [conversationId]: {
                        ...state.conversations[conversationId],
                        messages: [
                            action.data.message,
                            ...state.conversations[conversationId].messages
                        ]
                    }
                }
            };
        case "update_local_message":
            const conversationIds = action.payload.conversationId;
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    [conversationIds]: {
                        ...state.conversations[conversationIds],
                        messages: action.payload.message
                    }
                }
            };
        case "self_user":
            return { ...state, selfUser: action.data };
        default:
            return state
    }
}