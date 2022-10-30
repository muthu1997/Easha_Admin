import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated, Image, StatusBar } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { smallcheck } from "../../../constants/icons";
import Text from "../../../component/text";
const { width } = Dimensions.get("screen")
const options = [
    {
        id: 1,
        title: "தமிழ்"
    },
    {
        id: 2,
        title: "English"
    },
    {
        id: 3,
        title: "हिन्दी"
    }
]
export default function Language(props) {
    const renderOptions = (item) => {
        return <View style={styles.optionContainer}>
        <Text type="heading" title={item.title} />
        {global.language === item.title ?
        <Image source={smallcheck} style={styles.checkIcon} resizeMode="contain" /> : null }
        </View>
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} />
            <Header
                back
                title="Language"
                style={{backgroundColor: COLOUR.WHITE}}
            />

            <View style={[styles.mainContainer]}>
                {options.map(item => {
                    return renderOptions(item)
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE,
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center'
    },
    optionContainer: {
        width: "100%",
        height: 60,
        borderBottomColor: COLOUR.GRAY,
        borderBottomWidth: 2,
        flexDirection: "row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal: 20
    },
    checkIcon: {
        width: 30,
        height: 30
    }
})