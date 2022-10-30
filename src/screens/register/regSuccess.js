import React, { useState, useRef } from "react";
import { View, StyleSheet, StatusBar, Image } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { check } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";

export default function Success(props) {

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle="dark-content" />
            <View style={styles.headingContainer}>
            <Image source={check} style={styles.mainIcon} />
                <Text title="Account Created!" type="title" style={{ fontSize: 28, marginVertical: 20 }} />
                <Text title="Dear user your account has been created successfully. Sign in to start using app." type="paragraph" style={{ width: "90%", textAlign: 'center' }} />
            </View>
            <View style={styles.formContainer}>
                <Button title="Continue" onPress={() => props.navigation.navigate("Dashboard")} style={[styles.buttonStyle, { marginTop: 35 }]} textStyle={{ color: COLOUR.WHITE }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: COLOUR.WHITE,
        paddingHorizontal: '10%'
    },
    mainIcon: {
        width: 150,
        height: 150
    },
    buttonStyle: {
        marginTop: 10,
        width: "100%"
    },
    headingContainer: {
        width: "100%",
        alignItems:'center'
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
        position: "absolute",
        bottom: 50
    },
    otpInput: {
        width: '80%', 
        height: 200
    },
    underlineStyleBase: {
        backgroundColor: COLOUR.LIGHTGRAY,
        borderRadius: 10,
        width: 55,
        height: 55
    },
    underlineStyleHighLighted: {
        backgroundColor: COLOUR.CYON_LIGHT,
        borderRadius: 10
    },
    mainIcon: {
        width: 80,
        height: 80
    },
})