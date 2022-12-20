import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as COLOUR from "../../../constants/colors";
import WebView from "react-native-webview";

export default function TermsandConditions(props) {
    const url = props.route.params.url;
    return (
        <View style={styles.container}>
             <WebView source={{
                uri: url
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