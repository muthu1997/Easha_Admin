import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, StatusBar, Dimensions, Modal, ToastAndroid, ScrollView, Alert } from "react-native";
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
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";
import { storeOrderDetails, storeCompletedOrderList, storePendingOrderList } from "../../../redux/actions";

const labels = ["New order", "Accepted", "Payment", "Shipment", "Delivered"];
const labels1 = ["New order", "Accepted", "Shipment", "Delivered"];
export default function MyOrdersDetails(props) {
    const order_id = props.route.params.orderData._id;
    const [expDate, setExpDate] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);
    const [buttonText, setButtonText] = useState("");
    const [orderContent, setOrderContent] = useState("");
    const [trackId, setTrackId] = useState("");
    const refRBSheet = useRef();
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const orderData = useSelector(state => state.orderDetails)

    useEffect(() => {
        getOrderDetails();
    }, [])

    function getOrderDetails() {
        dispatch(storeOrderDetails(order_id)).then(res => {
            let orderDatas = res;
            setTrackId(res.trackId);
            setLoading(false);
            if (orderDatas.status === "PROCESSING") {
                setButtonText("Accept Order")
                setOrderContent("By accepting the order, user may know that the order work has started.")
            }
            if (orderDatas.status === "INPROCESS") {
                setButtonText("Complete")
                setOrderContent("Completed button may send notification to the user with updated order status.")
            }
            if (orderDatas.status === "PAYMENT") {
                setButtonText("Shipment")
                setOrderContent("Shipment button send the notification to the customer, that the order has shipped.")
            }
            if (orderDatas.status === "SHIPMENT") {
                setButtonText("Mark as delivered")
                setOrderContent("Delivered button change the status of order to delivered.")
            }
            let unPaidDue = orderDatas.status === "PROCESSING" ? 0 : orderDatas.status === "INPROCESS" ? 1 : orderDatas.status === "PAYMENT" ? 2 : orderDatas.status === "SHIPMENT" ? 3 : orderDatas.status === "DELIVERED" ? 4 : 0;
            let paidDue = orderDatas.status === "PROCESSING" ? 0 : orderDatas.status === "INPROCESS" ? 1 : orderDatas.status === "SHIPMENT" ? 2 : orderDatas.status === "DELIVERED" ? 3 : 0;
            let status = orderDatas.amountDue === 0 ? paidDue : unPaidDue;
            setOrderStatus(status)
        }).catch(error => {
            ToastAndroid.show("Something went wrong. please go back and try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG);
            setLoading(false);
        })
    }

    function updateExpiryDate() {
        setBtnLoader(true);
        let options = {
            "expDelDate": expDate
        }
        putMethod(`order/edit/${orderData._id}`, options).then((res) => {
                getOrderDetails();
                setBtnLoader(false);
                refRBSheet.current.close();
                ToastAndroid.show("Expiry date updated.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
        }).catch(err => {
            setBtnLoader(false)
            ToastAndroid.show("Something went wrong.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
        })
    }

    function updateShipId() {
        let options = {
            "trackId": trackId
        }
        putMethod(`order/edit/${orderData._id}`, options).then((res) => {
                getOrderDetails();
                ToastAndroid.show("Track ID updated.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
        }).catch(err => {
            setBtnLoader(false)
            ToastAndroid.show("Something went wrong.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
        })
    }

    function updateOrderFunction() {
        if(!orderData.expDelDate) {
            return ToastAndroid.show("Please update the expiry date first and try.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
        }else {
            Alert.alert("","Are you sure, want to move next step?",[
                {
                    text: "CONTINUE",
                    onPress: () => {
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
                        putMethod(`order/edit/${orderData._id}`, options).then((res) => {
                            console.log(res)
                                getOrderDetails();
                                setBtnLoader(false)
                                sendFirebaseNotification(message, orderData?.user.token);
                                dispatch(storePendingOrderList())
                                dispatch(storeCompletedOrderList())
                        }).catch(err => {
                            setBtnLoader(false)
                            ToastAndroid.show("Something went wrong.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
                        })
                    }
                },
                {
                    text: "CANCEL"
                }
            ])
        }
    }

    function renderAddressCard() {
        return (
            <View style={styles.cardContainer}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text title={`${orderData?.addressId.type}`} type="hint" style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
                </View>
                <Text title={`${orderData?.user.name},`} type="paragraph" style={{ color: COLOUR.PRIMARY, fontSize: 16 }} />
                <Text title={`${orderData?.addressId?.houseNo}, ${orderData?.addressId?.street}`} type="paragraph" style={{ color: COLOUR.BLACK, fontSize: 14 }} />
                <Text title={`${orderData?.addressId?.area},`} type="paragraph" style={{ color: COLOUR.BLACK, fontSize: 12, marginVertical: 2 }} />
                <Text title={`${orderData?.addressId?.city} - ${orderData?.addressId?.zip},`} type="paragraph" style={{ color: COLOUR.BLACK, fontSize: 12, marginVertical: 2 }} />
                <Text title={`${orderData?.addressId?.state}, ${orderData?.addressId?.country}`} type="paragraph" style={{ color: COLOUR.BLACK, fontSize: 12 }} />
                <Text title={`Mobile: ${orderData?.phone}`} type="paragraph" style={{ color: COLOUR.BLACK, fontSize: 12 }} />
            </View>
        )
    }

    function renderProductCard(item, index) {
        return (
            <View key={index} style={styles.pcardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.product.image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
                <View style={[styles.dataContainer]}>
                    <Text title={item.product.name} type="label" lines={1} />
                    <Text title={`${item.sizeId.size_title}`} type="label" lines={2} style={{ fontSize: 14, color: COLOUR.ORANGE_DARK }} />
                    <Text title={`₹ ${item.sizeId.price}`} type="label" lines={2} style={{ fontSize: 16, color: COLOUR.GREEN }} />
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
                    // minDate={moment()}
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
                    <Text title={"Subtotal"} type="label" lines={1} style={{color: COLOUR.DARK_GRAY}} />
                    <Text title={`₹ ${orderData?.subTotal}`} type="label" lines={2} style={{ color: COLOUR.BLACK }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between" }]}>
                    <Text title={"Delivery Price"} type="label" lines={1} style={{color: COLOUR.DARK_GRAY}} />
                    <Text title={`₹ ${orderData?.deliveryPrice}`} type="label" lines={2} style={{ color: COLOUR.BLACK }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 40, alignItems: "center", justifyContent: "space-between", borderTopWidth: 1 }]}>
                    <Text title={"Total"} type="label" lines={1} style={{color: COLOUR.DARK_GRAY}} />
                    <Text title={`₹ ${orderData?.totalPrice}`} type="label" lines={2} style={{ color: COLOUR.GREEN }} />
                </View>
            </View>
        )
    }
    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <View style={styles.container}>
            <Header
                title="Order details"
                back
                onBackPress={() => props.navigation.goBack()}
            />
            {orderData ? <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10 }} >
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
                    title="Delivery address" />
                {renderAddressCard()}
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", alignSelf: "center", height: 60, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: COLOUR.LIGHTGRAY }]}>
                    <Text title={`Expected delivery date: ${orderData?.expDelDate ? moment(orderData?.expDelDate).format("DD MMM YYYY") : ""}`} type="label" lines={1} style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
                    {orderData.status !== "DELIVERED" ? <Button title={"Update"} onPress={() => refRBSheet.current.open()} style={{ alignSelf: "center", height: 30, width: "25%", backgroundColor: COLOUR.WHITE }} textStyle={{ color: COLOUR.ORANGE_DARK }} /> : null }
                </View>
                {orderData.status === "SHIPMENT" ? <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", alignSelf: "center", height: 60, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: COLOUR.LIGHTGRAY }]}>
                    <View style={{flexDirection: "row", alignItems:"center", width: "70%"}}>
                    <Text title={`Track ID:`} type="label" lines={1} style={{ color: COLOUR.DARK_GRAY, fontSize: 12 }} />
                    <Input
                    placeholder={"Type here"}
                    value = {trackId}
                    onChangeText={data => setTrackId(data)}
                    style={{width: "80%"}} />
                    </View>
                    <Button title={"Update"} onPress={() => updateShipId()} style={{ alignSelf: "center", height: 30, width: "25%", backgroundColor: COLOUR.WHITE }} textStyle={{ color: COLOUR.ORANGE_DARK }} /> 
                </View> : null }

                <TitleContainer
                    title="Products" />
                {orderData.orderItems.map((item, index) => {return renderProductCard(item, index)} )}
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                    <Text title={"Payment Method"} type="label" lines={1}  style={{color: COLOUR.DARK_GRAY}}/>
                    <Text title={"Online"} type="label" lines={2} style={{ color: COLOUR.BLACK }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                    <Text title={"Amount Paid"} type="label" lines={1}  style={{color: COLOUR.DARK_GRAY}}/>
                    <Text title={`₹ ${orderData?.amountPaid}`} type="label" lines={2} style={{ color: COLOUR.BLACK }} />
                </View>
                <View style={[styles.dataContainer, { flexDirection: "row", width: "100%", height: 30, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderRadius: 10, backgroundColor: COLOUR.WHITE }]}>
                    <Text title={"Amount Due"} type="label" lines={1}  style={{color: COLOUR.DARK_GRAY}}/>
                    <Text title={`₹ ${orderData?.amountDue}`} type="label" lines={2} style={{ color: COLOUR.RED }} />
                </View>
                {renderTotal()}
            </ScrollView> : null}
            {orderData.status !== "DELIVERED" ? <View style={styles.updateContainer}>
                <View style={{ width: "60%" }}>
                    <Text title={orderContent} type="hint" lines={2} />
                </View>
                <Button title={buttonText} loader={btnLoader} onPress={() => {
                    if(orderData.status === "SHIPMENT") {
                        if(!orderData.trackId) {
                            return ToastAndroid.show("Please update track id to continue", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
                        }else {
                            return updateOrderFunction()
                        }
                    }else {
                        return updateOrderFunction()
                    }
                    }} style={{ marginVertical: 10, width: "40%" }} />
            </View> : null }
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
            <Modal visible={showErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to load the service. Connectivity issue is there. Please press try again button to load again."
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setLoading(true);
                        getOrderDetails();
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
                        getOrderDetails();
                        setNetErrorComponent(false);
                    }}
                    icon={net_failure} />
            </Modal>
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
        paddingHorizontal: 20,
        backgroundColor: COLOUR.WHITE,
        borderBottomWidth: 3,
        borderBottomColor: COLOUR.CARD_BG
    },
    pcardContainer: {
        width: "90%",
        height: 100,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        alignSelf: "center",
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    imageContainer: {
        width: "25%",
        height: "100%",
    },
    dataContainer: {
        width: "75%",
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
        alignItems: "center",
        backgroundColor: COLOUR.CARD_BG,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
})