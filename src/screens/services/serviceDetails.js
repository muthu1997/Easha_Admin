import React, { useState, useRef } from "react";
import { View, StyleSheet, StatusBar, Image } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { check } from "../../../constants/icons";
import Text from "../../../component/text";
import TitleContainer from "../../../component/titleContainer";
import Button from "../../../component/button";
import Header from "../../../component/header";
import ServiceCategoryList from "../../../component/serviceList";

export default function Success(props) {

    return (
        <View style={styles.container}>
            <Header
                back
                title="Order Detail" />
            <View style={{ width: 10, height: 10 }} />
            <View style={styles.mainContainer}>
                <TitleContainer
                    title="Select Service Category" />
                    <ServiceCategoryList
                    onSubmit={() => props.navigation.navigate("ServiceAddress")}
                    vertical />
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
        backgroundColor: COLOUR.WHITE,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingTop: 10
    }
})