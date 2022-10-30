import React from "react";
import { View, StyleSheet, Image } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { electronic_repair } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";

export default function Corousal(props) {
    return (
        <View style={styles.container}>
            <Text title={`Under construction`} type="title" style={{ color: COLOUR.WHITE, textAlign: "center", fontSize: 25 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: COLOUR.PRIMARY
    },
    mainIcon: {
        width: 80,
        height: 80
    },
    buttonStyle: {
        backgroundColor: COLOUR.WHITE,
        marginTop: "15%"
    },
    logoContainer: {
        width: "100%",
        height: "60%",
        alignItems:'center',
        justifyContent: "center"
    }
})