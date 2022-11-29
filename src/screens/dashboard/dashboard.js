import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, SafeAreaView, Dimensions, FlatList, Image } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { LineChartFunction } from "../../../component/chart";
import Loader from "../../../component/loader";
import { refer } from "../../../constants/icons";
import Text from "../../../component/text";

const Options = [
    {
        _id: 1,
        title: "Total Categories",
        count: 8,
        type: "Total",
        color: "#f3a683"
    },
    {
        _id: 2,
        title: "Total Products",
        count: 25,
        type: "Total",
        color: "#55efc4"
    },
    {
        _id: 3,
        title: "Total Orders",
        count: 15,
        type: "Total",
        color: "#778beb"
    },
    {
        _id: 4,
        title: "Orders Pending",
        count: 20,
        type: "Total",
        color: "#e77f67"
    },
    {
        _id: 5,
        title: "Orders Inprocess",
        count: 30,
        type: "Total",
        color: "#b2bec3"
    },
    {
        _id: 6,
        title: "Orders Completed",
        count: 45,
        type: "Total",
        color: "#cd84f1"
    }
]
const Week = [
    {
        _id: 1,
        title: "Orders Pending",
        count: 20,
        type: "Week"
    },
    {
        _id: 1,
        title: "Orders Inprocess",
        count: 30,
        type: "Week"
    },
    {
        _id: 1,
        title: "Orders Completed",
        count: 45,
        type: "Week"
    }
]
const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100
    ]
}
export default function Dashboard(props) {
    const [getTotalAnalytics, setTotalAnalytics] = useState([]);
    const [getWeeklyAnalytics, setWeeklyAnalytics] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDashboardAnalytics();
    }, [])
    async function getDashboardAnalytics() {
        setTotalAnalytics(Options);
        setWeeklyAnalytics(Week);
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
            <LineChartFunction data={monthlyData.data} labels={monthlyData.labels} />
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
    if(loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLOUR.PRIMARY} barStyle="dark-content" />
            <Header name />
            <FlatList
                data={getTotalAnalytics}
                renderItem={({ item, index }) => {
                    return renderTotalItems(item, index);
                }}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                ListFooterComponent={() => {
                    return renderFooterComponent()
                }} />
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