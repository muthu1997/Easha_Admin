import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { right_arrow, account, referrel, contactus, feedback, language, logout } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Share from 'react-native-share';
const { width } = Dimensions.get("screen")
const menuData = [
    {
        id: 1,
        item: "Photo sizes",
        icon: "image-size-select-large",
        screen: "PhotoSizeList"
    },
    {
        id: 2,
        item: "Delivery charges",
        icon: "truck-delivery-outline",
        screen: "DeliveryCharge"
    },
    {
        id: 3,
        item: "Shop Setup",
        icon: "shopping-outline",
        screen: "ShopList"
    },
    {
        id: 4,
        item: "Main Categories",
        icon: "domain-plus",
        screen: "MainCategoryScreen"
    }
]
export default function Success(props) {
    const onShare = () => {
        const shareOptions = {
            title: 'Share about the app',
            failOnCancel: false,
            // urls: [images.image1, images.image2],
        };
        Share.open(shareOptions)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }

    const renderCard = item => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                if (item.screen === "share") {
                    onShare();
                } else {
                    props.navigation.navigate(item.screen)
                }
            }} style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Icon name={item.icon} size={25} />
                </View>
                <View style={styles.dataContainer}>
                    <View>
                        <Text type="label" title={item.item} />
                    </View>
                    <View style={styles.imageContainer}>
                        <Icon name={"chevron-right"} size={25} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <Header
                title="Settings"
            />
            <View style={styles.mainContainer}>
                <FlatList
                    data={menuData}
                    renderItem={({ item, index }) => {
                        return (
                            renderCard(item)
                        )
                    }}
                    keyExtractor={item => item.id} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.LIGHTBG
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLOUR.BACKGROUND
    },
    cardContainer: {
        width: "95%",
        padding: 10,
        backgroundColor: COLOUR.BACKGROUND,
        borderRadius: 10,
        borderTopRightRadius: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "center",
        borderBottomWidth: 1,
        borderBottomColor: COLOUR.GRAY
    },
    imageContainer: {
        width: 30,
        height: 30,
        borderRadius: 5,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center"
    },
    dataContainer: {
        width: "85%",
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    itemImage: {
        width: "100%",
        height: "100%"
    }
})