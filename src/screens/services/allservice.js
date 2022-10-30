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
const {width, height} = Dimensions.get("screen");
export default function Success(props) {
    const bottomSheet = useRef();

    const renderBottomView = () => {
        return (
            <View style={styles.bottomContainer}>
            <TitleContainer
                title="Device details" />
                <View style={{width:"100%", borderWidth: 1, borderColor: COLOUR.GRAY}} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Header
                back
                search
                filter
                title="Back" />
            <View style={{ width: 10, height: 10 }} />
            <View style={styles.mainContainer}>
                <TitleContainer
                    title="Our Services" />
                <ServiceContainer
                    compress={false}
                    onNavigate={() => {
                        // bottomSheet.current.open();
                        props.navigation.navigate("ServiceDetails")
                        }} />
            </View>
            <RBSheet
                ref={bottomSheet}
                height={height / 2}
                openDuration={250}
                customStyles={{
                    container: {
                        justifyContent: "center",
                        alignItems: "center",
                        borderTopRightRadius: 50,
                        borderTopLeftRadius: 50
                    }
                }}
            >
                {renderBottomView()}
            </RBSheet>
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
    },
    bottomContainer: {
        width: "100%",
        height: "100%",
        padding: 10
    }
})