import * as React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Text from "./text";
import * as COLOUR from "../constants/colors";
import {fanimage, acimage, wmachine, fridgeimage} from "../constants/icons";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const {width, height} = Dimensions.get("screen")

const dummyData = [
    {
        id: 1,
        title: "Hitachi AC",
        icon: acimage
    },
    {
        id: 2,
        title: "Goodreg Fan",
        icon: fanimage
    },
    {
        id: 3,
        title: "Washing Machine",
        icon: wmachine
    },
    {
        id: 4,
        title: "Wirlpool Fridge",
        icon: fridgeimage
    }
]
const DashboardOrder = props => {
    return (
        <View style={[styles.headerContainer, props.style]}>
           <FlatList
                data={dummyData}
                horizontal={props.vertical ? false : true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity activeOpacity={0.8} style={styles.card}>
                        <View style={styles.imgContainer}>
                            <Image source={item.icon} resizeMode="contain" style={{width: "80%", height: "80%"}} />
                        </View>
                        <View style={styles.detailsContainer}>
                        <Text type="heading" title={item.title} />
                        <Text type="heading" title={`(${item.id})`} />
                        </View>
                    </TouchableOpacity>
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    card: {
        width: width / 1.8,
        height: 120,
        backgroundColor: COLOUR.CARD_BG,
        margin: 5,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 1,
        overflow: "hidden"
    },
    detailsContainer: {
        width: "60%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgContainer: {
        width: "40%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOUR.LIGHTBG
    },
    catText: {
        color: COLOUR.DARK_BLUE
    }
});

export default DashboardOrder;