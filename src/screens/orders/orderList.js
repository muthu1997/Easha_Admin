import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image, ToastAndroid, Modal, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { check } from "../../../constants/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "../../../component/text";
import { getMethod, deleteMethod } from "../../../utils/function"
import Button from "../../../component/button";
import moment from "moment";
const { width } = Dimensions.get("screen")
import { storePendingOrderList, storeCompletedOrderList } from "../../../redux/actions";
import { RoundButton } from "../../../component/roundButton";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";

export default function Success(props) {
    const [getOrderList, setOrderList] = useState([]);
    const [isPending, setIsPending] = useState(true);
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const pendingOrderList = useSelector(state => state.pendingOrderList)
    const completedOrderList = useSelector(state => state.completedOrderList)

    useEffect(() => {
        getPendingOrders();
        getCompletedOrders();
    }, [])

    function getPendingOrders() {
        setLoading(true)
        dispatch(storePendingOrderList()).then(res => {
            setOrderList(res)
        }).catch(error => {
            ToastAndroid.show("Something went wrong. please go back and try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG);
            setLoading(false);
        })
    }

    function getCompletedOrders() {
        dispatch(storeCompletedOrderList()).then(res => {
            setLoading(false);
        }).catch(error => {
            ToastAndroid.show("Something went wrong. please go back and try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG);
        })
    }

    const renderCard = item => {
        if (item.status === "PROCESSING") { item.statusCode = 0 }
        if (item.status !== "PROCESSING" && item.status !== "DELIVERED") { item.statusCode = 1 }
        if (item.status === "DELIVERED") { item.statusCode = 2 }
        return (
            <TouchableOpacity onPress={() => props.navigation.navigate("OrderDetails", { orderData: item })} style={styles.cardContainer}>
                <View style={styles.itemTop}>
                    <View style={styles.dataContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.orderItems[0].product?.image[0].image }} style={styles.itemImage} resizeMode="contain" />
                        </View>
                        <View style={styles.itemHeader}>
                            {item.orderItems.map((item1, index) => {
                                return index < 2 ? <View key={index}><Text type="label" title={item1.product?.name} /></View> : null
                            })}
                            <Text type="paragraph" title={`${item.orderItems.length}${item.orderItems.length > 1 ? 'items' : 'item'}`} style={{ color: COLOUR.DARK_GRAY }} />
                        </View>
                    </View>
                </View>
                <View style={styles.itemBottom}>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={`Ordered on ${moment(item.dateOrdered).format("DD MMM YY")}`} style={{ color: COLOUR.BLACK }} />
                        {item.status !== "DELIVERED" ? <TouchableWithoutFeedback>
                        <RoundButton onPress={() => props.navigation.navigate("ChatScreen", { customer: { _id: item.user._id, name: item.user.name } })} icon="chat" />
                        </TouchableWithoutFeedback> : null }
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Order ID"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.orderId} style={{ color: COLOUR.BLACK }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Total Amount"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={`₹${item.totalPrice}`} style={{ color: COLOUR.GREEN }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Status"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.status} style={{ color: item.status === "PROCESSING" ? COLOUR.ORANGE_DARK : item.status === "INPROCESS" ? COLOUR.PRIMARY : item.status === "PAYMENT" ? COLOUR.CYON : item.status === "SHIPMENT" ? COLOUR.SECONDARY : COLOUR.GREEN }} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <View style={styles.container}>
            <Header
                title="Order List"
            />
            <View style={styles.optionButtonContainer}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { setIsPending(true); setOrderList(pendingOrderList); }} style={[styles.optionButton, { borderColor: isPending ? COLOUR.WHITE : COLOUR.PRIMARY }]}>
                    <Text type="paragraph" title={`Pending`} style={{ color: COLOUR.WHITE, fontSize: 18 }} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { setIsPending(false); setOrderList(completedOrderList); }} style={[styles.optionButton, { borderColor: !isPending ? COLOUR.WHITE : COLOUR.PRIMARY }]}>
                    <Text type="paragraph" title={`Completed`} style={{ color: COLOUR.WHITE, fontSize: 18 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
                <FlatList
                    data={isPending ? pendingOrderList : completedOrderList}
                    renderItem={({ item, index }) => {
                        return (
                            renderCard(item)
                        )
                    }}
                    ListEmptyComponent={() => {
                        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Text type="paragraph" title={"No orders found."} style={{ color: COLOUR.DARK_GRAY }} />
                        </View>
                    }}
                    keyExtractor={item => item._id} />
            </View>
            <Modal visible={showErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to load the service. Connectivity issue is there. Please press try again button to load again."
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setLoading(true);
                        getProductList(props.route.params.catId);
                        setErrorComponent(false);
                    }}
                    icon={failure} />
            </Modal>
            <Modal visible={showNetErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to connect. Please check your internet and try again"
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setLoading(true);
                        getProductList(props.route.params.catId);
                        setNetErrorComponent(false);
                    }}
                    icon={net_failure} />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.CARD_BG,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLOUR.CARD_BG,
    },
    cardContainer: {
        width: "100%",
        padding: 10,
        backgroundColor: COLOUR.WHITE,
        alignItems: "center",
        marginBottom: 5,
        alignSelf: "center",
        overflow: "hidden"
    },
    imageContainer: {
        width: Dimensions.get("screen").width / 5,
        height: Dimensions.get("screen").width / 5,
        borderRadius: 5,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center"
    },
    dataContainer: {
        width: "85%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        overflow: "hidden"
    },
    statusContainer: {
        width: "30%",
        height: 30,
        backgroundColor: COLOUR.CARD_BG,
        position: "absolute",
        top: -30,
        right: 0,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row"
    },
    callBtn: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: COLOUR.GREEN,
        alignItems: "center",
        justifyContent: "center"
    },
    optionButtonContainer: {
        width: Dimensions.get("screen").width,
        height: 50,
        backgroundColor: COLOUR.PRIMARY,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    optionButton: {
        width: Dimensions.get("screen").width / 2,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 5
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    itemImage: {
        width: "100%",
        height: "100%"
    },
    itemHeader: {
        width: "100%",
        height: Dimensions.get("screen").width / 5,
        paddingHorizontal: 5
    },
    itemTop: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    itemBottom: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
})