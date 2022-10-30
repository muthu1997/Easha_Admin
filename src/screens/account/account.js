import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { right_arrow, account, referrel, contactus, feedback, language, logout } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Share from 'react-native-share';
const { width } = Dimensions.get("screen")
const menuData = [
    {
        id: 1,
        item: "My profile",
        image: account,
        screen: "Profile"
    },
    {
        id: 2,
        item: "Refer a friend",
        image: referrel,
        screen: "share"
    },
    {
        id: 3,
        item: "Contact us",
        image: contactus
    },
    {
        id: 4,
        item: "Send feedback",
        image: feedback,
        screen: "Feedback"
    },
    {
        id: 5,
        item: "Choose Language",
        image: language,
        screen: "Language"
    },
    {
        id: 6,
        item: "Sign out",
        image: logout
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
                if(item.screen === "share"){
                    onShare();
                }else {
                    props.navigation.navigate(item.screen)
                }
                }} style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                </View>
                <View style={styles.dataContainer}>
                    <View>
                        <Text type="heading" title={item.item} />
                    </View>
                    <Image source={right_arrow} style={{ width: 20, height: 20 }} resizeMode="contain" />
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <Header
                title="Account"
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
        backgroundColor: COLOUR.BACKGROUND,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingTop: 50
    },
    cardContainer: {
        width: "90%",
        padding: 10,
        backgroundColor: COLOUR.BACKGROUND,
        borderRadius: 10,
        borderTopRightRadius: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
        alignSelf: "center"
    },
    imageContainer: {
        width: 30,
        height: 30,
        borderRadius: 5,
        backgroundColor: COLOUR.LIGHTBG,
        overflow: "hidden"
    },
    dataContainer: {
        width: "85%",
        height: 50,
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
    itemImage: {
        width: "100%",
        height: "100%"
    }
})