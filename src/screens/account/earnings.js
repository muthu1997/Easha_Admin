import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert, TouchableOpacity, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Loader from "../../../component/loader";
import { postMethod } from "../../../utils/function";
import { getFundRaiseDetails, getPaymentDetails } from "../../../redux/actions";
import { useDispatch } from "react-redux";
/* basic imports */
import { useSelector } from "react-redux";

export default function EarningDetailScreen(props) {
    /* loader and error components */
    const [loader, setLoader] = useState(false);
    const [showFundRaisedMessage, setShowFunRaisedMessage] = useState(false);
    const Earnings = useSelector(state => state.earning_details);
    const FundDetails = useSelector(state => state.fund_details);
    const dispatch = useDispatch();

    useEffect(() => {
        if (FundDetails.filter(x => x.status === "PENDING").length > 0) {
            setShowFunRaisedMessage(true);
        }
    }, [])

    function claimFunction() {
        if (Earnings.amount_pending > 10) {
            Alert.alert("Confirm!", `Are you sure, want to claim ${Earnings.amount_pending} in to your bank account?`, [
                {
                    text: "Yes",
                    onPress: () => raiseClaimTicket()
                },
                {
                    text: "Cancel"
                }
            ])
        } else {
            ToastAndroid.show("You need greater than 10 Rupees to claim amount.", ToastAndroid.CENTER, ToastAndroid.BOTTOM);
        }
    }
    function raiseClaimTicket() {
        setLoader(true);
        const body = {
            "amount": Earnings.amount_pending,
            "user_id": global.uid
        }
        postMethod(`seller/fund`, body).then(response => {
            console.log(response)
            dispatch(getPaymentDetails(global.uid));
            dispatch(getFundRaiseDetails(global.uid)).then(response => {
                setShowFunRaisedMessage(true);
                setLoader(false);
            })
        }).catch(error => {
            setLoader(false);
            console.log(error);
        })
    }
    const renderCard = item => {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer}>
                <View style={styles.itemBottom}>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="label" title={`Earning Details`} style={{ color: COLOUR.BLACK }} />
                        {item.amount_pending > 10 ? <TouchableOpacity onPress={() => claimFunction()} style={styles.roundButton}>
                            <Text type="paragraph" title={"Claim"} style={{ color: COLOUR.WHITE }} />
                        </TouchableOpacity> : null}
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Total Income"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.total_income} style={{ color: COLOUR.BLACK }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Amount Released"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.amount_claimed} style={{ color: COLOUR.BLACK }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Upcoming Release"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.amount_processing} style={{ color: COLOUR.BLACK }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Amount Claimable"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.amount_pending} style={{ color: COLOUR.BLACK }} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    if (loader) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }

    return (
        <View style={styles.container}>
            <Header
                title="Payout Options"
                back
                onBackPress={() => props.navigation.goBack()}
            />
            {showFundRaisedMessage ?
                <View style={styles.loaderContainer}>
                    <Text type="paragraph" title={"Your fund raise query is under progress.\nPlease wait for your request to be completed."} style={{ color: COLOUR.DARK_GRAY, textAlign: "center" }} />
                </View> :
                <View style={styles.mainContainer}>
                    {renderCard(Earnings)}
                </View>}
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
        width: "40%",
        height: 35,
        backgroundColor: COLOUR.GREEN,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})