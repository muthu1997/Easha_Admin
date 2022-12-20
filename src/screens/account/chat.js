import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, ToastAndroid, DeviceEventEmitter } from "react-native";
import * as COLOUR from "../../../constants/colors";
const { width } = Dimensions.get("screen");
import { WebView } from 'react-native-webview';

export default function ChatScreen(props) {
    return (
        <View style={styles.container}>
            <WebView source={{
                uri: 'https://app.chaport.com/widget/show.html?appid=6347eba60c6d6fc647ff4791'
            }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    }
})