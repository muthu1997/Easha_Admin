import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, ToastAndroid, DeviceEventEmitter, ActivityIndicator } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { postMethod, getMethod } from "../../../utils/function";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfileData } from "../../../redux/actions";
import { useDispatch } from 'react-redux';
import * as STRINGS from "../../../constants/strings";
import SplashScreen from 'react-native-splash-screen'
const { width } = Dimensions.get("screen");

export default function Login(props) {
    const [mobile, setMobile] = useState("");
    const [ccode, setCCode] = useState("+91");
    const [password, setPassword] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);
    const [resetLoader, setResetLoader] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        SplashScreen.hide();
    },[])

    function loginFunction() {
        setBtnLoader(true)
        if (password != "" && password.length < 8) {
            setBtnLoader(false)
            ToastAndroid.showWithGravity("Password should be atleast 8 characters.", ToastAndroid.SHORT, ToastAndroid.CENTER);
        } else {
            if (mobile != "" && password != "" && password.length > 7) {
                var data = {
                    phone: mobile,
                    password: password,
                    country_code: ccode,
                    isAdmin: true
                }
                console.log(data)
                postMethod('user/loginadmin', data).then(async res => {
                    await AsyncStorage.setItem(STRINGS.TOKEN, res.token);
                    global.token = res.token;
                    console.log(res)
                    global.headers = true;
                        setMobile("");
                        setPassword("");
                        ToastAndroid.showWithGravity("Logged In.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                        setTimeout(() => {
                            routerFunction(res);
                        },1500)
                        setBtnLoader(false)
                }).catch(error => {
                    ToastAndroid.showWithGravity(error.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
                    setBtnLoader(false)
                })
            } else {
                setBtnLoader(false)
                ToastAndroid.showWithGravity("Please fill all fields.", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        }
    }

    async function routerFunction(data) {
        console.log("global.token", global.token)
        console.log("global.headers", global.headers)
        await AsyncStorage.setItem(STRINGS.UID, data.userId);
        props.navigation.navigate("Homescreen");
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text title={"Sign In"} type="label" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 24 }]} />
                <Text title={"Welcome back!"} type="label" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 18 }]} />
                <Text title={"Please login to continue"} type="label" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 18 }]} />
            </View>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Mobile Number"
                    value={mobile}
                    keyboardType="number-pad"
                    country={true}
                    onChangeText={data => setMobile(data)}
                    style={[styles.inputStyle, { width: "100%" }]} />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={data => setPassword(data)}
                    eye={true}
                    secureTextEntry={true}
                    style={[styles.inputStyle, { width: "100%", marginTop: 15 }]} />
            </View>
            <Button
                title="Log In"
                loader={btnLoader}
                onPress={() => loginFunction()}
                style={styles.login} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    titleContainer: {
        width: "100%",
        height: "25%",
        justifyContent: "center",
        padding: 20
    },
    iconContainer: {
        width: width,
        height: 80,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20
    },
    profileImageBtn: {
        width: 70,
        height: 70,
        borderRadius: 25,
        overflow: "hidden"
    },
    profileImage: {
        width: "100%",
        height: "100%"
    },
    register: {
        width: width / 3,
        height: 35
    },
    inputContainer: {
        width: width,
        height: "30%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    login: {
        width: width - 40,
        alignSelf: "center"
    },
    forgot: {
        width: width,
        height: 50,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    }
})