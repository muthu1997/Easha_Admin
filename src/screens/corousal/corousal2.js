import React from "react";
import { View, StyleSheet, Image, StatusBar } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { technecian } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";

export default function Corousal(props) {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.BACKGROUND} barStyle="dark-content" />
            <Image source={technecian} style={styles.mainIcon} resizeMode="contain" />
            <Text title="Repair Man" type="title" />
            <Text title="Repair service at your doorstep" type="paragraph" />
            <Button title="NEXT" onPress={() => props.navigation.navigate("Signup")} style={styles.buttonStyle} textStyle={{ color: COLOUR.WHITE }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: COLOUR.WHITE
    },
    mainIcon: {
        width: 80,
        height: 80
    },
    buttonStyle: {
        marginTop: "15%"
    }
})