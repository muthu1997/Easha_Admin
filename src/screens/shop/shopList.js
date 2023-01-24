import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, ToastAndroid, Modal } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import moment from "moment";
const { width } = Dimensions.get("screen")
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getShopList } from "../../../redux/actions";
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
    const shopList = useSelector(state => state.shopList)

    useEffect(() => {
            getShopListFunction();
    }, [])

    function getShopListFunction() {
        setLoading(true)
        dispatch(getShopList(user._id)).then(res => {
            console.log(res)
            return setLoading(false)
        }).catch(error => {
            ToastAndroid.show("Something went wrong. please go back and try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG);
            return setLoading(false);
        })
    }


    const renderCard = item => {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer}>
                <View style={styles.itemBottom}>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                            <Text type="label" title={`${item.shopName}`} style={{ color: COLOUR.BLACK }} />
                            <TouchableOpacity onPress={() => props.navigation.navigate("UpdateShop", { data: item })} style={styles.roundButton}>
                                <Icon name="pencil-outline" size={25} color={COLOUR.WHITE} />
                            </TouchableOpacity>
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Address"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.shopAddress} style={{ color: COLOUR.GRAY }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"City"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={`${item.shopCity} - ${item.shopZipCode}`} style={{ color: COLOUR.GRAY }} />
                    </View>
                    <View style={[styles.dataContainer, { width: "100%" }]}>
                        <Text type="paragraph" title={"Status"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={item.shopStatus} style={{ color: COLOUR.ORANGE}} />
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
                title="Shop List"
                back
                onBackPress={() => props.navigation.goBack()}
                rightIcon={shopList.length > 0 ? null : "plus-circle"}
                onRightButtonPress={() => props.navigation.navigate("NewShop")}
            />
            <View style={styles.mainContainer}>
                <FlatList
                    data={shopList}
                    renderItem={({ item, index }) => {
                        return (
                            renderCard(item)
                        )
                    }}
                    ListEmptyComponent={() => {
                        return <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
                        <Text type="paragraph" title={"No shops found."} style={{ color: COLOUR.DARK_GRAY }} />
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
    roundButton: {
        width: 35,
        height: 35,
        backgroundColor: COLOUR.GREEN,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    }
})