import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, ActivityIndicator, ToastAndroid, ScrollView, Alert } from "react-native";
import * as COLOUR from "../../../constants/colors";
import StepIndicator from 'react-native-step-indicator';
import Header from "../../../component/header";
import Text from "../../../component/text";
import Button from "../../../component/button";
import TitleContainer from "../../../component/titleContainer";
const { width, height } = Dimensions.get("screen");
import { putMethod, getMethod, sendFirebaseNotification } from "../../../utils/function";
import Input from "../../../component/inputBox";
import RBSheet from "react-native-raw-bottom-sheet";
import moment from "moment";
import CalendarPicker from 'react-native-calendar-picker';

const labels = ["Order\nplaced", "In progress", "Waiting for\npayment", "Product\nshipped", "Delivered"];
const labels1 = ["Order\nplaced", "In progress", "Product\nshipped", "Delivered"];
export default function MyOrdersDetails(props) {
    const order_id = props.route.params.orderData._id;
    const [orderData, setOrderData] = useState({});
    const [expDate, setExpDate] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);
    const [loader, setLoader] = useState(true);
    const [buttonText, setButtonText] = useState("");
    const refRBSheet = useRef();

    useEffect(() => {
        getOrderDetails();
    }, [])

    function getOrderDetails() {
        setLoader(true);
        console.log(order_id)
        getMethod(`order/${order_id}`, res => {
            if (res !== "error") {
                setOrderData(res.data[0]);
                let orderData = res.data[0];
                if (orderData.status === "PROCESSING") {
                    setButtonText("Accept Order")
                }
                if (orderData.status === "INPROCESS") {
                    setButtonText("Mark as completed")
                }
                if (orderData.status === "PAYMENT") {
                    setButtonText("Ship the product")
                }
                if (orderData.status === "SHIPMENT") {
                    setButtonText("Mark as delivered")
                }
                let status = orderData.status === "PROCESSING" ? 0 : orderData.status === "INPROCESS" ? 1 : orderData.status === "PAYMENT" ? 2 : orderData.status === "SHIPMENT" ? 3 : orderData.status === "DELIVERED" ? 4 : 0
                setOrderStatus(status)
                setLoader(false);
                setTimeout(() => {
                },3000)
            }
        })
    }

    function updateExpiryDate() {
        let options = {
        "expDelDate": expDate
    }
        putMethod(`order/edit/${orderData._id}`, options, (res) => {
            console.log(res)
            if (res.success === true) {
                getOrderDetails();
                setBtnLoader(false);
                refRBSheet.current.close();
            } else {
                setBtnLoader(false)
                Alert.alert("Easha Arts", "Something went wrong.")
            }
        })
    }

    function updateOrderFunction() {
        setBtnLoader(true)
        let message;
        var getStatus;
        if (orderData.status === "PROCESSING") {
            getStatus = "INPROCESS";
            message = `Dear ${orderData?.user.name}, Your order was accepted and the status changed to inprocess. The artist started the painting work for your order and you can view the expected delivery date by visiting the order details screen. Will update you the status once we completed the work.`;
        }
        if (orderData.status === "INPROCESS") {
            if (orderData?.amountDue === 0) {
                getStatus = "SHIPMENT";
                message = `Dear ${orderData?.user.name}, Artist completed the job for your order and the product was shipped to your address. You can find the tracking details by visiting the order details screen.`
            } else {
                getStatus = "PAYMENT";
                message = `Dear ${orderData?.user.name}, Artist completed the job for your order and the product is waiting for your payment. Once you done the pending payment of your order we will start shipment process shortly.`
            }
        }
        if (orderData.status === "PAYMENT") {
            getStatus = "SHIPMENT";
            message = `Dear ${orderData?.user.name}, Hoooray! Your order is on the way. You can see the tracking details by visiting the order details screen.`;
        }
        if (orderData.status === "SHIPMENT") {
            getStatus = "DELIVERED";
            message = `Dear ${orderData?.user.name}, Your order is delivered and we hope you love our product. If you have any compleint or any query feel free to react us by visiting Query page.`;
        }
        let options = {
            "status": getStatus
        }
        putMethod(`order/edit/${orderData._id}`, options, (res) => {
            console.log(res)
            if (res.success === true) {
                getOrderDetails();
                setBtnLoader(false)
                sendFirebaseNotification(message, orderData?.user.token);
            } else {
                setBtnLoader(false)
                Alert.alert("Easha Arts", "Something went wrong.")
            }
        })
    }

    function renderAddressCard() {
        return (
            <View style={styles.cardContainer}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: COLOUR.GRAY, borderRadius: 5 }}>
                        <Text title={`${orderData?.addressId.type}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
                    </View>
                </View>
                <Text title={`${orderData?.user.name},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.PRIMARY, fontSize: 16 }} />
                <Text title={`${orderData?.addressId?.houseNo}, ${orderData?.addressId?.street}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 14 }} />
                <Text title={`${orderData?.addressId?.area},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12, marginVertical: 2 }} />
                <Text title={`${orderData?.addressId?.city} - ${orderData?.addressId?.zip},`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12, marginVertical: 2 }} />
                <Text title={`${orderData?.addressId?.state}, ${orderData?.addressId?.country}`} type="ROBOTO_MEDIUM" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
                <Text title={`Mobile: ${orderData?.phone}`} type="ROBOTO_REGULAR" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
            </View>
        )
    }

    function renderProductCard(item, index) {
        return (
            <View style={styles.pcardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.product.image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
                <View style={[styles.dataContainer]}>
                    <Text title={item.product.name} type="label" lines={1} />
                    <Text title={"Wooden frame"} type="label" lines={2} style={{ fontSize: 14, color: COLOUR.ORANGE_DARK }} />
                    <View style={styles.dimensionContainer}>
                        <Text title={`${item.product.width} × ${item.product.height} ${item.product.type}`} type="label" lines={2} style={{ fontSize: 8, color: COLOUR.WHITE }} />
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text title={`₹ ` + item.product.price} type="label" lines={1} style={{ color: COLOUR.PRIMARY }} />
                </View>
            </View>
        )
    }

    const renderExpiryDate = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLOUR.LIGHTBG }}>
                <Text type="heading" title={`Update expiry date`} style={{ color: COLOUR.PRIMARY, fontWeight: "500" }} />
                <CalendarPicker
                    onDateChange={data => setExpDate(data)}
                    minDate={moment()}
                />
                <View style={{ flexDirection: "row", marginTop: 25 }}>
                    <Button onPress={() => updateExpiryDate()} title="Update" loader={btnLoader} style={{ width: "40%", margin: 5, backgroundColor: COLOUR.RED }} />
                    <Button onPress={() => refRBSheet.current.close()} title="Cancel" style={{ width: "40%", margin: 5 }} />
                </View>
            </View>
        )
    }

    function renderTotal() {
        return (
            <View style={[styles.cardContainer, { flexDirection: "column", justifyContent: "center", marginTop: 20 }]}>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Subtotal"} type="label" lines={1} />
                    <Text title={`₹ ${orderData?.subTotal}`} type="label" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Delivery Price"} type="label" lines={1} />
                    <Text title={`₹ ${orderData?.deliveryPrice}`} type="label" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between", borderTopWidth: 1 }]}>
                    <Text title={"Total"} type="label" lines={1} />
                    <Text title={`₹ ${orderData?.totalPrice}`} type="label" lines={2} style={{ color: COLOUR.PRIMARY }} />
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle={"dark-content"} />
            <Header
                style={{ backgroundColor: "transparent" }}
                back
                onBackPress={() => props.navigation.goBack()}
                title={"Order Details"} />
            {loader ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={COLOUR.PRIMARY} size="large" />
            </View> :
                orderData ? <ScrollView showsVerticalScrollIndicator={false}>
                    {orderData?.amountDue === 0 ?
                        <StepIndicator
                            customStyles={customStyles}
                            currentPosition={orderStatus}
                            stepCount={4}
                            labels={labels1}
                        /> : <StepIndicator
                            customStyles={customStyles}
                            stepCount={5}
                            currentPosition={orderStatus}
                            labels={labels}
                        />}
                    <TitleContainer
                        title="Delivery Address" />
                    {renderAddressCard()}
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "90%", alignSelf: "center", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10, borderRadius: 10, backgroundColor: COLOUR.GREEN }]}>
                        <Text title={"Expected delivery date"} type="label" lines={1} style={{ color: COLOUR.WHITE, fontSize: 12 }} />
                        <Text title={moment(orderData?.expDelDate).format("DD MMM YYYY")} type="label" lines={2} style={{ color: COLOUR.WHITE, fontSize: 12 }} />
                    </View>
                    <Button title={"Update delivery date"} onPress={() => refRBSheet.current.open()} style={{ alignSelf: "center", height: 35, width: "50%", marginTop: 10, backgroundColor: COLOUR.CYON }} />
                    <View style={styles.updateContainer}>
                        <TitleContainer
                            title="Update order" />
                        <Button title={buttonText} loader={btnLoader} onPress={() => updateOrderFunction()} />
                    </View>
                    <TitleContainer
                        title="Order Bill" />
                    {orderData.orderItems.map((item, index) => {
                        return renderProductCard(item, index);
                    })}
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                        <Text title={"Payment Method"} type="label" lines={1} />
                        <Text title={"Online"} type="label" lines={2} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                        <Text title={"Amount Paid"} type="label" lines={1} />
                        <Text title={`₹ ${orderData?.amountPaid}`} type="label" lines={2} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                        <Text title={"Amount Due"} type="label" lines={1} />
                        <Text title={`₹ ${orderData?.amountDue}`} type="label" lines={2} style={{ color: COLOUR.RED }} />
                    </View>
                    {renderTotal()}
                </ScrollView> : null
            }
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={height / 1.5}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                {renderExpiryDate()}
            </RBSheet>
        </View>
    )
}

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: COLOUR.PRIMARY,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: COLOUR.PRIMARY,
    stepStrokeUnFinishedColor: COLOUR.GRAY,
    separatorFinishedColor: COLOUR.PRIMARY,
    separatorUnFinishedColor: COLOUR.GRAY,
    stepIndicatorFinishedColor: COLOUR.PRIMARY,
    stepIndicatorUnFinishedColor: COLOUR.WHITE,
    stepIndicatorCurrentColor: COLOUR.WHITE,
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: COLOUR.PRIMARY,
    stepIndicatorLabelFinishedColor: COLOUR.WHITE,
    stepIndicatorLabelUnFinishedColor: COLOUR.GRAY,
    labelColor: COLOUR.GRAY,
    labelSize: 13,
    currentStepLabelColor: COLOUR.PRIMARY
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    cardContainer: {
        width: "100%",
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: COLOUR.WHITE,
        marginVertical: 5
    },
    dataContainer: {
        width: "41%",
        height: "100%",
    },
    pcardContainer: {
        width: "90%",
        height: 100,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        alignSelf: "center",
        elevation: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    imageContainer: {
        width: "25%",
        height: "100%",
    },
    dataContainer: {
        width: "41%",
        height: "100%",
    },
    priceContainer: {
        width: "30%",
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "space-between"
    },
    dimensionContainer: {
        width: "70%",
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: COLOUR.GRAY,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    updateContainer: {
        width: "100%",
        alignItems: "center"
    }
})