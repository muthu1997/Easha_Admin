import React, { useEffect, useState } from "react";
import { View, StyleSheet, ToastAndroid, KeyboardAvoidingView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { useSelector, useDispatch } from 'react-redux';
import { getShopList } from "../../../redux/actions";
import { postMethod, getMethod, putMethod } from "../../../utils/function";

export default function ShopAddressScreen(props) {
    const user = useSelector(state => state.profile);
    const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [area, setArea] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [phone, setPhone] = useState("");
    const [additionalPhone, setAdditionalPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [loader, setLoader] = useState(false);
    const [pinValidated, setPinValidated] = useState(false);
    const dispatch = useDispatch();
    const shopData = props.route.params.data;
    useEffect(() => {
        let addressData = shopData.shopAddress.split(",");
        console.log(shopData)
        setHouseNo(String(shopData.shopDoorNo));
        if(addressData.length > 1) {
            setStreet(addressData[0]);
            setArea(addressData[1]);
        }
        if(addressData.length === 1) {
            setStreet(addressData[0]);
        }
        setCity(shopData.shopCity);
        setZip(String(shopData.shopZipCode));
        setState(shopData.shopState);
        setCountry(shopData.shopCountry);
        setCompanyName(shopData.shopName);
        setPhone(String(shopData.shopPhone));
        setAdditionalPhone(String(shopData.shopAdditionalPhone));
    },[])

    function submitAddress() {
        setLoader(true);
        if (companyName != "" && houseNo != "" && street != "" && area != "" && zip != "" && state != "" && country != "" && phone != "") {
            let data = {
                "shopName": companyName,
                "shopDoorNo": Number(houseNo),
                "shopAddress": `${street}, ${area}`,
                "shopCity": city,
                "shopState": state,
                "shopCountry": country,
                "shopPhone": Number(phone),
                "shopAdditionalPhone": Number(additionalPhone),
                "shopZipCode": zip
            }
            return putMethod(`shop/${shopData._id}`, data).then(res => {
                setHouseNo("");
                setStreet("");
                setArea("");
                setCity("");
                setZip("");
                setState("");
                setCountry("");
                setLoader(false);
                setCompanyName("");
                setPhone("");
                setAdditionalPhone("");
                ToastAndroid.showWithGravity("Shop added successfully.", ToastAndroid.SHORT, ToastAndroid.CENTER);
                getAddressList();
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

    function getAddressList() {
        dispatch(getShopList(user._id))
    }

    function getCityByPin() {
        console.log(zip)
        if (zip !== "" || zip !== null) {
            return getMethod(`getcitystate/${zip}`).then(response => {
                let result = response.data;
                setCity(result.City);
                setState(result.State);
                setCountry("India");
                setPinValidated(true);
                return console.log(response)
            }).catch(error => {
                console.log(error);
                return ToastAndroid.show("Something went wrong while fetching ZIP code data.", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
            })
        } else {
            return ToastAndroid.show("Enter ZIP code to get City, State and Country", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
        }
    }

    return (
        <View style={styles.container}>
            <Header
                back
                onBackPress={() => props.navigation.goBack()}
                title="Update Shop" />
            <KeyboardAvoidingView style={{ flex: 1, alignItems: "center" }} behavior="padding">
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Company name"
                        value={companyName}
                        onChangeText={data => setCompanyName(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Door no."
                        value={houseNo}
                        keyboardType="number-pad"
                        onChangeText={data => setHouseNo(data)}
                        style={[styles.inputStyle, { width: "38%" }]} />
                    <Input
                        placeholder="Street"
                        value={street}
                        onChangeText={data => setStreet(data)}
                        style={[styles.inputStyle, { width: "60%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Village / Area"
                        value={area}
                        onChangeText={data => setArea(data)}
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Phone number"
                        value={phone}
                        onChangeText={data => setPhone(data)}
                        keyboardType="number-pad"
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Additional phone number(optional)"
                        value={additionalPhone}
                        onChangeText={data => setAdditionalPhone(data)}
                        keyboardType="number-pad"
                        style={[styles.inputStyle, { width: "100%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="City"
                        value={city}
                        editable={false}
                        onChangeText={data => setCity(data)}
                        style={[styles.inputStyle, { width: "58%", backgroundColor: COLOUR.GRAY }]} />
                    <Input
                        placeholder="PIN / ZIP Code"
                        value={zip}
                        onChangeText={data => setZip(data)}
                        onSubmitEditing={() => getCityByPin()}
                        keyboardType="number-pad"
                        style={[styles.inputStyle, { width: "40%" }]} />
                </View>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="State"
                        value={state}
                        editable={false}
                        onChangeText={data => setState(data)}
                        style={[styles.inputStyle, { width: "48%", backgroundColor: COLOUR.GRAY }]} />
                    <Input
                        placeholder="Country"
                        value={country}
                        editable={false}
                        onChangeText={data => setCountry(data)}
                        style={[styles.inputStyle, { width: "50%", backgroundColor: COLOUR.GRAY }]} />
                </View>
                <Button
                    onPress={() => !loader ? submitAddress() : null }
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