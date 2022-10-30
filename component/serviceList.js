import * as React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Text from "./text";
import * as COLOUR from "../constants/colors";
import { fanimage } from "../constants/icons";
import Button from "../component/button";
const { width, height } = Dimensions.get("screen")

const dummyData = [
    {
        id: 1,
        title: "Reinstall OS",
        description: "Including install support software and clean all virus",
        amount: 250,
        icon: fanimage
    },
    {
        id: 2,
        title: "Keyboard Service",
        description: "Including repair set and clean the keyboard",
        amount: 230,
        icon: fanimage
    },
    {
        id: 3,
        title: "Hard Drive Service",
        description: "Including delete the virus backup data and set the hardware",
        amount: 550,
        icon: fanimage
    },
    {
        id: 4,
        title: "Display Service",
        description: "Including check the damage and change of new displasy",
        amount: 1250,
        icon: fanimage
    }
]
const cartButton = () => {
    return <View style={styles.cartButtonStyle}>
        <TouchableOpacity activeOpacity={0.8} style={styles.smallButton}>
            <Icon name="minus" color={COLOUR.PRIMARY} />
        </TouchableOpacity>
        <View style={[styles.smallButton, { backgroundColor: COLOUR.CARD_BG }]}>
            <Text type="label" title={1} style={{ color: COLOUR.PRIMARY }} />
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.smallButton}>
            <Icon name="plus" color={COLOUR.PRIMARY} />
        </TouchableOpacity>
    </View>
}
const ServiceCategoryList = props => {
    return (
        <View style={[styles.headerContainer, props.style]}>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={dummyData}
                    horizontal={props.vertical ? false : true}
                    renderItem={({ item, index }) => {
                        return <TouchableOpacity activeOpacity={0.8} style={styles.card}>
                            <View style={styles.imgContainer}>
                                <Image source={item.icon} resizeMode="contain" style={{ width: "80%", height: "80%" }} />
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text type="heading" title={item.title} />
                                <Text type="paragraph" title={`${item.description}`} style={{ color: COLOUR.GRAY }} />
                                <View style={styles.amountContainer}>
                                    <Text type="heading" title={`₹ ${item.amount}`} style={{color: COLOUR.DARK_BLUE}} />
                                    {cartButton()}
                                </View>
                                <Text type="label" title={'Number of device: 1'} style={{ fontSize: 12 }} />
                            </View>
                        </TouchableOpacity>
                    }} />
            </View>
            <View style={{ width: "100%", height: 75, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View>
                    <Text type="heading" title={`Total Amount`} />
                    <Text type="heading" title={`₹ 1200`} style={{ color: COLOUR.PRIMARY }} />
                </View>
                <Button title="Continue" style={{ width: "50%" }} onPress={() => props.onSubmit()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: COLOUR.WHITE
    },
    card: {
        width: "90%",
        height: 150,
        backgroundColor: COLOUR.CARD_BG,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 1,
        overflow: "hidden",
        alignSelf: "center",
        margin: 5
    },
    detailsContainer: {
        width: "70%",
        height: "100%",
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    imgContainer: {
        width: "30%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOUR.LIGHTBG
    },
    catText: {
        color: COLOUR.DARK_BLUE
    },
    amountContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    cartButtonStyle: {
        width: "40%",
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLOUR.LIGHTBG,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    smallButton: {
        width: "33%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOUR.LIGHTBG
    }
});

export default ServiceCategoryList;