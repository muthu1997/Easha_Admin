import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { check } from "../../../constants/icons";
import Text from "../../../component/text";
import TitleContainer from "../../../component/titleContainer";
import Button from "../../../component/button";
import Header from "../../../component/header";
import ServiceContainer from "../../../component/serviceContainer";
import RBSheet from "react-native-raw-bottom-sheet";
const { width, height } = Dimensions.get("screen");
export function FailureComponent(props) {
    return (
        <View style={styles.container}>
            <Image source={props.icon} style={styles.iconStyle} resizeMode="contain" />
            <Text title={props.errtitle} type="heading" style={styles.headingStyle} />
            <Text title={props.errdescription} type="paragraph" style={styles.headingStyle} />
            <View style={styles.buttonContainer}>
                {props.negativeTitle ? <Button title={props.negativeTitle} onPress={() => props.onPressNegative()} style={styles.negativeBtnStyle} textStyle={styles.btnText} /> : null }
                <Button title={props.positiveTitle} onPress={() => props.onPressPositive()} style={styles.positiveBtnStyle} textStyle={styles.btnText} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.CARD_BG,
        alignItems: "center",
        justifyContent: "center"
    },
    iconStyle: {
        width: width / 3,
        height: width / 3
    },
    headingStyle: {
        color: COLOUR.BLACK,
        marginTop: 10,
        textAlign: "center",
        width: "90%"
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        paddingVertical: 20
    },
    positiveBtnStyle: {
        backgroundColor: COLOUR.CARD_BG,
        borderWidth: 2,
        borderColor: COLOUR.PRIMARY
    },
    negativeBtnStyle: {
        backgroundColor: COLOUR.CARD_BG,
        marginBottom: 10
    },
    btnText: {
        color: COLOUR.PRIMARY
    }
})