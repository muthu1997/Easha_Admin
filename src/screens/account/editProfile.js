import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { putMethod } from "../../../utils/function";
import { updateProfileData } from "../../../redux/actions";
import Header from "../../../component/header";
import { useSelector, useDispatch } from 'react-redux';
const { width } = Dimensions.get("screen");

export default function EditProfile(props) {
    const [btnLoader, setBtnLoader] = useState(false);
    const user = useSelector(state => state.profile);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const dispatch = useDispatch();

    function updateProfile() {
        if (name === "" && name.length < 3 && email === "") {
            ToastAndroid.showWithGravity("Please enter valide name.", ToastAndroid.SHORT, ToastAndroid.CENTER);
        } else {
            if (name != "") {
                setBtnLoader(true)
                var data = {
                    "name": name,
                    "email": email
                }
                console.log(user._id)
                putMethod(`user/update/${user._id}`, data).then(res => {
                    console.log(res)
                    if (res.success === true) {
                        getUserData();
                        ToastAndroid.showWithGravity("Updated successfully.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                        setBtnLoader(false)
                    } else {
                        ToastAndroid.showWithGravity("Something went wrong. Please try again.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                        setBtnLoader(false)
                    }
                })
            } else {
                ToastAndroid.showWithGravity("Please fill all fields.", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        }
    }

    const getUserData = () => {
        dispatch(updateProfileData(user._id));
    }

    return (
        <View style={styles.container}>
            <Header
                back
                onBackPress={() => props.navigation.goBack()}
                title="" />
            <View style={styles.titleContainer}>
                <Text title={"Edit Profile"} type="ROBOTO_BOLD" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 24 }]} />
                <Text title={"You can only update your name."} type="LOUIS_LIGHT" lines={2} style={[{ color: COLOUR.BLACK, fontSize: 18 }]} />
            </View>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="User Name"
                    value={name}
                    onChangeText={data => setName(data)}
                    style={[styles.inputStyle, { width: "100%" }]} />

                <Input
                    placeholder="User Email"
                    value={email}
                    onChangeText={data => setEmail(data)}
                    style={[styles.inputStyle, { width: "100%" }]} />
            </View>
            <Button
                title="Update Profile"
                loader={btnLoader}
                onPress={() => updateProfile()}
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