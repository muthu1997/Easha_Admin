import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, SafeAreaView, Dimensions, FlatList, Image, Modal } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { LineChartFunction } from "../../../component/chart";
import Text from "../../../component/text";
import { storeAnalytics } from "../../../redux/actions";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../component/loader";
import { refer, failure, net_failure } from "../../../constants/icons";

const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: []
}
export default function Dashboard(props) {
    const analytics = useSelector(state => state.analytics)
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        getDashboardAnalytics();
    }, [])
    async function getDashboardAnalytics() {
        if (await isInternetConnection()) {
            dispatch(storeAnalytics()).then(res => {
                monthlyData.data = res.incomeData;
                setLoading(false);
            }).catch(error => {
                setLoading(false);
                setErrorComponent(true);
            })
        }else {
            setNetErrorComponent(true);
        }
    }
    function renderTotalItems(item, index) {
        return <View style={[styles.itemContainer, { backgroundColor: item.color }]}>
            <Text title={item.count} type="heading" style={{ color: COLOUR.WHITE }} />
            <View style={styles.itemBottomContainer}>
                <Text title={item.title} type="hint" style={{ color: COLOUR.WHITE }} />
            </View>
        </View>
    }
    function renderFooterComponent() {
        return <View style={styles.footerContainer}>
            <View style={styles.titleContainerView}>
                <Text title={"Income"} type="heading" style={{ color: COLOUR.BLACK }} />
            </View>
            {monthlyData.data?.length > 0 ? <LineChartFunction data={monthlyData.data} labels={monthlyData.labels} /> : null}
            <View style={styles.delayContainer}>
                <Text title={"!oops orders shipment got delay.."} type="label" style={{ color: COLOUR.RED }} />
                <Text title={"Please check orders with red mark"} type="hint" style={{ color: COLOUR.RED }} />
            </View>
            <View style={styles.referralContainer}>
                <Image source={refer} style={styles.refImgContainer} resizeMode="contain" />
                <View style={styles.refContentContainer}>
                    <Text title={"Refer and get rewarded!"} type="label" style={{ color: COLOUR.PRIMARY }} />
                    <Text title={"Invite your friends to join with us and \nget full amount for all orders without any \ndeduction for 1 month."} type="hint" style={{ color: COLOUR.PRIMARY }} />
                </View>
            </View>
        </View>
    }
    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLOUR.PRIMARY} barStyle="dark-content" />
            <Header name />
            <FlatList
                data={analytics.analytics}
                renderItem={({ item, index }) => {
                    return renderTotalItems(item, index);
                }}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                ListFooterComponent={() => {
                    return renderFooterComponent()
                }} />
            {/* <Modal visible={showErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to load the service. Connectivity issue is there. Please press try again button to load again."
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setLoading(true);
                        getDashboardAnalytics();
                        setErrorComponent(false);
                    }}
                    icon={failure} />
            </Modal> */}
            <Modal visible={showNetErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to connect. Please check your internet and try again"
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setLoading(true);
                        getDashboardAnalytics();
                        setNetErrorComponent(false);
                    }}
                    icon={net_failure} />
            </Modal>
        </SafeAreaView>
    )
}

let { width, height } = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLOUR.WHITE
    },
    itemContainer: {
        width: width / 3.5,
        height: width / 4,
        backgroundColor: COLOUR.WHITE,
        margin: 5,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    itemBottomContainer: {
        width: "100%",
        height: "30%",
        backgroundColor: COLOUR.SECONDARY_LIGHT,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0
    },
    footerContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 10
    },
    titleContainerView: {
        width: "100%",
        paddingLeft: 10
    },
    delayContainer: {
        width: "100%",
        backgroundColor: COLOUR.CARD_BG,
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: "center",
        borderRadius: 10
    },
    referralContainer: {
        width: "100%",
        backgroundColor: COLOUR.CARD_BG,
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
        flexDirection: "row",
    },
    refImgContainer: {
        width: "30%",
        height: 80
    },
    refContentContainer: {
        overflow: "hidden"
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})