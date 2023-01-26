import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
const { width } = Dimensions.get("screen")
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getPendingSellerBankDetails } from "../../../redux/actions";
import { putMethod } from "../../../utils/function";
/* basic imports */
import { useSelector, useDispatch } from "react-redux";

export default function BankListPendingScreen(props) {
    /* loader and error components */
    const [bankPendingList, setBankPendingList] = useState("");
    const bankList = useSelector(state => state.bankList)
    const dispatch = useDispatch();

    useEffect(() => {
       getBankPendingList();
    },[]);

    function getBankPendingList() {
        dispatch(getPendingSellerBankDetails)
        .then(response => {
            setBankPendingList(response);
        }).catch(error => {
            console.log(error);
        })
    }

    function updateBankStatus(_id) {
            let data = {
                "status": "ACTIVE"
            }
            return putMethod(`seller/baccount/${_id}`, data).then(res => {
                ToastAndroid.showWithGravity("Bank details updated successfully.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                return getBankPendingList();
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
                            <Text type="label" title={`${item.user_name}`} style={{ color: COLOUR.BLACK }} />
                            <TouchableOpacity onPress={() => updateBankStatus(item._id)} style={styles.roundButton}>
                                <Icon name="check-outline" size={25} color={COLOUR.WHITE} />
                            </TouchableOpacity>
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Bank"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.name} style={{ color: COLOUR.GRAY }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Account No:"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={`${String(item.acc_no)}`} style={{ color: COLOUR.GRAY }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"IFSC:"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={`${String(item.ifsc)}`} style={{ color: COLOUR.GRAY }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Status"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.status} style={{ color: COLOUR.ORANGE}} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <Header
                title="Payout Options"
                back
                onBackPress={() => props.navigation.goBack()}
            />
            <View style={styles.mainContainer}>
                <FlatList
                    data={bankPendingList}
                    renderItem={({ item, index }) => {
                        return (
                            renderCard(item)
                        )
                    }}
                    ListEmptyComponent={() => {
                        return <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
                        <Text type="paragraph" title={"No data's found."} style={{ color: COLOUR.DARK_GRAY, textAlign: "center" }} />
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