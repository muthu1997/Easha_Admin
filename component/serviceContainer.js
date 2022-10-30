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
        title: "AC \nService",
        icon: acimage
    },
    {
        id: 2,
        title: "Fan \nService",
        icon: fanimage
    },
    {
        id: 3,
        title: "Washing\nMachine",
        icon: wmachine
    },
    {
        id: 4,
        title: "Fridge \nService",
        icon: fridgeimage
    }
]
const DashboardOrder = props => {
    return (
        <View style={[styles.headerContainer, props.style]}>
           <FlatList
                data={dummyData}
                numColumns={2}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity activeOpacity={0.8} onPress={() => props.onNavigate()} style={styles.card}>
                        <Text type="heading" title={item.title} style={styles.catText} />
                        <View style={styles.catIcon}>
                            <Image source={item.icon} resizeMode="contain" style={{width: "100%", height: "100%"}} />
                        </View>
                    </TouchableOpacity>
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        alignItems: 'center',
        paddingHorizontal: 20
    },
    card: {
        width: width / 2.3,
        backgroundColor: COLOUR.CARD_BG,
        margin: 5,
        borderRadius: 10,
        justifyContent: "center",
        paddingLeft: "5%",
        paddingVertical: 30,
        elevation: 1
    },
    catIcon: {
        width: "100%",
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    catText: {
        color: COLOUR.DARK_BLUE
    }
});

export default DashboardOrder;