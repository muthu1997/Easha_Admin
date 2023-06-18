import React, { useEffect, useState } from "react";
import { View, StyleSheet, ToastAndroid, KeyboardAvoidingView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { useSelector, useDispatch } from 'react-redux';
import { postMethod } from "../../../utils/function";
import { getBankDetails } from "../../../redux/actions";

export default function NewBankDetails(props) {
    const [name, setName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [loader, setLoader] = useState(false);
    const [userName, setUserName] = useState("");
    const dispatch = useDispatch();

    function submitBankDetails() {
        setLoader(true);
        if (name != "" && accountNumber != "" && ifsc != "" && userName !== "") {
            let data = {
                "name": name,
                "acc_no": Number(accountNumber),
                "ifsc": ifsc,
                "status": "PENDING",
                "user_name": userName,
                "user_id": global.uid
            }
            return postMethod(`seller/baccount`, data).then(res => {
                ToastAndroid.showWithGravity("Bank details updated successfully.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                dispatch(getBankDetails(global.uid));
                return props.navigation.goBack(null);
            }).catch(error => {
                ToastAndroid.showWithGravity("Something went wrong. Please try again later.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                return setLoader(false);
            })
        } else {
            ToastAndroid.showWithGravity("Please fill all fields!", ToastAndroid.SHORT, ToastAndroid.CENTER);
            return setLoader(false);
        }
    }

    return (
        <View style={styles.container}>
            <Header
                back
                onBackPress={() => props.navigation.goBack()}
                title="Bank details update" />
            <KeyboardAvoidingView style={{ flex: 1, alignItems: "center" }} behavior="padding">
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Account holdet name"
                        value={userName}
                        onChangeText={data => setUserName(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Bank name"
                        value={name}
                        onChangeText={data => setName(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="IFSC Code"
                        value={ifsc}
                        keyboardType="number-pad"
                        onChangeText={data => setIfsc(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Account number"
                        value={accountNumber}
                        onChangeText={data => setAccountNumber(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <Button
                    onPress={() => !loader ? submitBankDetails() : null}
                    title="Update"
                    loader={loader}
                    style={{ marginTop: 30, backgroundColor: COLOUR.PRIMARY }} />
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    typeContainer: {
        width: "100%",
        height: 60,
        backgroundColor: COLOUR.LIGHTGRAY,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row"
    },
    inputContainer: {
        width: "100%",
        height: 60,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20
    },
    inputStyle: {
        width: "45%"
    }
})