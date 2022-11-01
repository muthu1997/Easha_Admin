import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, ActivityIndicator, Linking } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { check } from "../../../constants/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "../../../component/text";
import { getMethod, deleteMethod } from "../../../function"
import Button from "../../../component/button";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
const { width } = Dimensions.get("screen")

export default function Success(props) {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [getOrderList, setOrderList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [isPending, setIsPending] = useState(true);
    useEffect(() => {
        getPendingOrders();
        getCompletedOrders();
    }, [])

    function refreshFunction() {
        setLoader(true)
        getPendingOrders();
        getCompletedOrders();
    }

    function getPendingOrders() {
        getMethod('order/admin/pending', res => {
            if (res !== "error") {
                setPendingOrders(res.data);
                setOrderList(res.data);
                setLoader(false)
            } else {
                setLoader(false)
                alert("Problem while getting pending orders");
            }
        })
    }

    function getCompletedOrders() {
        getMethod('order/admin/delivered', res => {
            if (res !== "error") {
                setCompletedOrders(res.data);
                setLoader(false)
            } else {
                setLoader(false)
                alert("Problem while getting pending orders");
            }
        })
    }

    const renderCard = item => {
        if (item.status === "PROCESSING") { item.statusCode = 0 }
        if (item.status !== "PROCESSING" && item.status !== "DELIVERED") { item.statusCode = 1 }
        if (item.status === "DELIVERED") { item.statusCode = 2 }
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>props.navigation.navigate("OrderDetails",{ orderData: item })} style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Text type="heading" title={item.orderItems.length} />
                    <Text type="paragraph" title={`${item.orderItems.length > 1 ? 'items' : 'item'}`} style={{ color: COLOUR.BLACK }} />
                </View>
                <View style={styles.dataContainer}>
                    <View>
                        <Text type="heading" title={item.user.name} />
                        <Text type="paragraph" title={`Ordered on ${moment(item.dateOrdered).format("DD MMM YYYY")}`} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={`Paid: Rs.${item.amountPaid}`} style={{ color: COLOUR.GREEN }} />
                        <Text type="paragraph" title={`Pending: Rs.${item.amountDue}`} style={{ color: COLOUR.RED }} />
                        <Text type="paragraph" title={`Delivery: Rs.${item.deliveryPrice}`} style={{ color: COLOUR.CYON }} />
                        <View style={{width: "100%", height: 2, backgroundColor: COLOUR.GRAY, alignSelf: "center"}} />
                        <Text type="paragraph" title={`Total Worth: Rs.${item.totalPrice}`} style={{ color: COLOUR.PRIMARY, fontSize: 16 }} />
                    </View>
                    {item.status !== "DELIVERED" ?
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                        onPress={async() => {
                            await Linking.openURL(`tel:${item.user.country_code + item.phone}`)
                        }}
                        style={styles.callBtn} 
                        activeOpacity={0.8}>
                            <Icon name="phone" size={25} color={COLOUR.WHITE} />
                        </TouchableOpacity>
                    </View> : null }
                </View>

                <View style={[styles.statusContainer, { borderTopWidth: 2, borderTopColor: item.statusCode === 0 ? COLOUR.RED : item.statusCode === 1 ? COLOUR.PRIMARY : COLOUR.GREEN }]}>
                    <Text type="label" title={item.status} style={{ fontSize: 12, color: item.statusCode === 0 ? COLOUR.RED : item.statusCode === 1 ? COLOUR.PRIMARY : COLOUR.GREEN }} />
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <Header
                title="Order List"
            />
            <View style={styles.optionButtonContainer}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {setIsPending(true);setOrderList(pendingOrders);}} style={[styles.optionButton, {borderColor: isPending ? COLOUR.WHITE : COLOUR.PRIMARY}]}>
                        <Text type="paragraph" title={`Pending`} style={{ color: COLOUR.WHITE, fontSize: 18 }} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {setIsPending(false);setOrderList(completedOrders);}} style={[styles.optionButton, {borderColor: !isPending ? COLOUR.WHITE : COLOUR.PRIMARY}]}>
                        <Text type="paragraph" title={`Completed`} style={{ color: COLOUR.WHITE, fontSize: 18 }} />
                </TouchableOpacity>
            </View>
            {loader ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator color={COLOUR.PRIMARY} size="large" /> 
                    </View> :
            <View style={styles.mainContainer}>
                <FlatList
                    data={getOrderList}
                    renderItem={({ item, index }) => {
                        return (
                            renderCard(item)
                        )
                    }}
                    ListHeaderComponent={() => {return <View style={{width: "100%", height: 60, alignItems:"center", justifyContent: "center"}}>
                        <Button title="Refresh" onPress={() => refreshFunction()} />
                    </View>}}
                    keyExtractor={item => item._id} />
            </View> }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLOUR.BACKGROUND,
    },
    cardContainer: {
        width: "90%",
        padding: 10,
        backgroundColor: COLOUR.CARD_BG,
        borderRadius: 10,
        borderTopRightRadius: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
        marginTop: 30,
        alignSelf: "center"
    },
    imageContainer: {
        width: 50,
        height: 75,
        borderWidth: 1,
        borderColor: COLOUR.PRIMARY,
        borderRadius: 5,
        backgroundColor: COLOUR.LIGHTBG,
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
        alignItems:"center",
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
    }
})