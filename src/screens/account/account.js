import React, { useState } from "react";
import { View, StyleSheet, BackHandler, Dimensions, TouchableOpacity, DeviceEventEmitter, Alert, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../../../component/header";
import Text from "../../../component/text";
import { getFunction } from "../../../constants/apirequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {logoutFunction} from "../../redux/action";
import Button from "../../../component/button";
import * as STRINGS from "../../../constants/strings";
import { useSelector, useDispatch } from 'react-redux';
const { width } = Dimensions.get("screen");
const options = [
    {
        id: 1,
        name: "Edit Profile",
        code: "ep"
    },
    // {
    //     id: 2,
    //     name: "Setup Shop",
    //     code: "ep"
    // },
    {
        id: 3,
        name: "Terms And Conditions",
        code: "tc"
    },
    {
        id: 4,
        name: "Privacy Policy",
        code: "pp"
    },
    {
        id: 5,
        name: "Customer Support",
        code: "cs"
    }
]

const logoutoptions = [
    {
        id: 2,
        name: "Ask Question",
        code: "rq"
    },
    {
        id: 4,
        name: "Terms And Conditions",
        code: "tc"
    }
]
export default function CartScreen(props) {
    const user = useSelector(state => state.profile);
    const [custVisible, setCustVisible] = useState(false);
    const dispatch = useDispatch();

    function redirector(item) {
        if (item.code === "ma") {
            props.navigation.navigate("MyAddressList");
        } else if (item.code === "mo") {
            props.navigation.navigate("MyOrders");
        } else if (item.code === "rq") {
            props.navigation.navigate("Query");
        } else if (item.code === "tc" || item.code === "pp") {
            props.navigation.navigate("Terms", {url: item.code === "tc" ? 'https://sites.google.com/view/easha-chat/home' : 'https://sites.google.com/view/eashappolicy/home'});
        } else if (item.code === "ep") {
            props.navigation.navigate("EditProfile");
        } else if (item.code === "cs") {
            props.navigation.navigate("ChatScreen");
        }
    }

    async function logoutAllFunction() {
        Alert.alert("", "Are you sure, want to logout?", [
            {
                text: "LOGOUT",
                onPress: async() => {
                    await AsyncStorage.removeItem(STRINGS.UID);
                    await AsyncStorage.removeItem(STRINGS.TOKEN);
                    await AsyncStorage.removeItem(STRINGS.TOKEN_UPDATE);
                    global.headers = undefined;
                    ToastAndroid.show("Logging out", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
                    setTimeout(() => {
                        DeviceEventEmitter.emit("LOGOUT", true);
                    },1000)
                }
            },
            {
                text: "CANCEL"
            }
        ])
    }   

    return (
        <View style={styles.container}>
            <Header
                title="My Account" />
            <View style={styles.settingsContainer}>
                {user ?
                <View style={styles.optionsContainer}>
                    {options.map((item, index) => {
                        return <TouchableOpacity onPress={() => redirector(item)} key={index} activeOpacity={0.8} style={{ width: "100%", height: 40, justifyContent: "center", paddingHorizontal: 5 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text title={item.name} type="label" lines={1} style={{ color: COLOUR.BLACK }} />
                                <Icon name="chevron-right" size={25} color={COLOUR.BLACK} />
                            </View>
                        </TouchableOpacity>
                    })}
                </View> : 
                <View style={styles.optionsContainer}>
                {logoutoptions.map((item, index) => {
                    return <TouchableOpacity onPress={() => redirector(item)} key={index} activeOpacity={0.8} style={{ width: "100%", height: 40, justifyContent: "center", paddingHorizontal: 5 }}>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text title={item.name} type="label" lines={1} style={{ color: COLOUR.DARK_GRAY }} />
                            <Icon name="chevron-right" size={25} color={COLOUR.DARK_GRAY} />
                        </View>
                    </TouchableOpacity>
                })}
            </View>}
            </View>
            <View style={{ width: "100%", position: "absolute", bottom: 5, alignItems: "center" }}>
                {user ?
                <Button
                    title="Logout"
                    onPress={() => logoutAllFunction()}
                    style={{ width: "55%" }} /> : 
                    <Button
                    title="Login"
                    onPress={() => props.navigation.navigate("LoginScreen")}
                    style={{ width: "55%" }} /> }
                <Text title={'Version 1.0.0'} type="ROBOTO_MEDlabelIUM" lines={2} style={{ color: COLOUR.PRIMARY, fontSize: 10, marginTop: 10 }} />
                <Text title={'Contact developer @ 19smkumar97@gmail.com'} type="label" lines={2} style={{ color: COLOUR.PRIMARY, fontSize: 10 }} />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    profileContainer: {
        width: "100%",
        height: "40%",
        alignItems: "center",
        justifyContent: "center"
    },
    settingsContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: 10,
        borderColor: COLOUR.LIGHTGRAY
    },
    optionsContainer: {
        width: "100%",
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLOUR.WHITE
    }
})