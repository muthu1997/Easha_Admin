import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, SafeAreaView, ToastAndroid, Dimensions } from "react-native";
import * as COLOUR from "../constants/colors";
import Text from "./text";
import Button from "./button";
import { RoundButton } from "./roundButton";
const { width } = Dimensions.get("screen");

export function ImageHandler(props) {
    return <View style={[styles.container, props.style]}>
        <Image source={{uri: props.image}} style={styles.imageContainer} resizeMode="contain" />
        <RoundButton
        icon="delete"
        onPress={() => props.onPress()}
        style={styles.roundBtn} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: width / 2,
        height: width / 2,
        padding: 10,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderRightWidth: 0.2,
        borderLeftWidth: 0.2
    },
    imageContainer: {
        width: "100%",
        height: "100%"
    },
    roundBtn: {
        position: "absolute",
        bottom: 0,
        right: 0
    }
})