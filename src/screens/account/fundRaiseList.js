import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, ToastAndroid, Modal, Alert } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import moment from "moment";
const { width } = Dimensions.get("screen")
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getFundRaisePendingDetails } from "../../../redux/actions";
import { putMethod } from "../../../utils/function";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";

export default function ShopListScreen(props) {
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector(state => state.profile);
    const [fundRiseList, setFundRiseList] = useState([])

    useEffect(() => {
            getShopListFunction();
    }, [])

    function getShopListFunction() {
        setLoading(true)
        dispatch(getFundRaisePendingDetails()).then(res => {
            console.log(res)
            setFundRiseList(res);
            return setLoading(false)
        }).catch(error => {
            ToastAndroid.show("Something went wrong. please go back and try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG);
            return setLoading(false);
        })
    }

    function AcceptPayment(item) {
        Alert.alert("Confirm!", "Are you sure want to accept this payment?",[
            {
                text: "ACCEPT",
                onPress: () => updateFundStatus(item)
            },{
                text: "CANCEL"
            }
        ])
    }
    function updateFundStatus(item) {
        let data = {
            "status": "DONE"
        }
        return putMethod(`seller/fund/${item._id}`, data).then(res => {
            ToastAndroid.showWithGravity("Fund raised successfully.", ToastAndroid.SHORT, ToastAndroid.CENTER);
            getShopListFunction();
        }).catch(error => {
            ToastAndroid.showWithGravity("Something went wrong. Please try again later.", ToastAndroid.SHORT, ToastAndroid.CENTER);
            return setLoader(false);
        })
    }

    const renderCard = item => {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer}>
                <View style={styles.itemBottom}>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                            <Text type="label" title={`${item.user_id.name}`} style={{ color: COLOUR.BLACK }} />
                            <TouchableOpacity onPress={() => AcceptPayment(item)} style={styles.roundButton}>
                                <Icon name="check-outline" size={25} color={COLOUR.WHITE} />
                            </TouchableOpacity>
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Amount"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.amount} style={{ color: COLOUR.RED }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Created On"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={`${moment(item.created_at).format("DD MMM YY HH:mm")}`} style={{ color: COLOUR.BLACK }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Status"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.status} style={{ color: COLOUR.ORANGE}} />
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
                title="Fund Rise List"
                back
                onBackPress={() => props.navigation.goBack()}
            />
            <View style={styles.mainContainer}>
                <FlatList
                    data={fundRiseList}
                    renderItem={({ item, index }) => {
                        return (
                            renderCard(item)
                        )
                    }}
                    ListEmptyComponent={() => {
                        return <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
                        <Text type="paragraph" title={"No funds found."} style={{ color: COLOUR.DARK_GRAY }} />
                        </View>
                    }}
                    keyExtractor={item => item._id} />
            </View>
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
    roundButton: {
        width: 35,
        height: 35,
        backgroundColor: COLOUR.GREEN,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    }
})