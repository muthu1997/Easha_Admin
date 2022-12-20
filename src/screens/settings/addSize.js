import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, ToastAndroid, Modal, KeyboardAvoidingView, SafeAreaView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Input from "../../../component/inputBox";
import Button from "../../../component/button";
import { RadioButton } from "react-native-paper";
import { storeSizeList } from "../../../redux/actions";
import { postMethod } from "../../../utils/function"
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch } from "react-redux";
import { failure, net_failure } from "../../../constants/icons";

const { width } = Dimensions.get("screen")

export default function AddSize(props) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [length, setLength] = useState(0);
    const [weight, setWeight] = useState(0);
    const [weightType, setWeightType] = useState("KG");
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0);
    const [btnLoader, setBtnLoader] = useState(false);
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        // widthRef.current.focus()
    }, [])

    async function submitSizeData() {
        if (width > 0 && height > 0 && length > 0 && weight > 0 && type !== "" && price > 0) {
            setBtnLoader(true);
            if (await isInternetConnection()) {
                let body = {
                    "width": width,
                    "height": height,
                    "length": length,
                    "size_title": `${height} IN × ${width} IN × ${length} IN`,
                    "price": price,
                    "size_type": type,
                    "weight": weight,
                    "weight_type": weightType
                }
                postMethod("size/add", body).then(response => {
                    setBtnLoader(false);
                    setWeight(0);
                    setWidth(0)
                    setHeight(0)
                    setLength(0)
                    setPrice(0)
                    setType("")
                    dispatch(storeSizeList())
                    ToastAndroid.show("Data added successfully!", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
                }).catch(error => {
                    setBtnLoader(false);
                    setErrorComponent(true);
                })
            } else {
                setNetErrorComponent(true);
            }
        } else {
            ToastAndroid.show("Please fill all fields.", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
        }
    }

    function renderItems() {
        return (
            width ? <View style={styles.itemContainer}>
                <View style={{ width: "100%" }}>
                    <Text title={`${height} IN × ${width} IN × ${length} IN`} type="paragraph" style={{ color: COLOUR.GREEN }} />
                    <View style={styles.itemBtnContainer}>
                        {weight ? <Text title={`${weight}${weightType} `} type="paragraph" style={{ color: COLOUR.PRIMARY }} /> : null}
                        {price ? <Text title={`Rs.${price}`} type="paragraph" style={{ color: COLOUR.DARK_GRAY }} /> : null}
                    </View>
                </View>
            </View> : null
        )
    }

    function renderOptions(title, value) {
        return (
            <View style={styles.optionContainer}>
                <RadioButton color={COLOUR.PRIMARY} status={type === value ? "checked" : "unchecked"} onPress={() => setType(value)} />
                <Text title={title} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="New Size"
                back
                onBackPress={() => props.navigation.goBack()}
            />
            <KeyboardAvoidingView style={styles.mainContainer}>
                <View style={styles.inputContainer}>
                    <View style={{ width: "48%" }}>
                        <Text title={`Photo width`} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
                        <Input
                            value={width}
                            onChangeText={data => setWidth(data)}
                            keyboardType={"number-pad"}
                            placeholder="Width"
                            returnKeyType="next"
                            autoFocus={true}
                            style={styles.inputStyle} />
                    </View>
                    <View style={{ width: "48%" }}>
                        <Text title={`Photo height`} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
                        <Input
                            value={height}
                            onChangeText={data => setHeight(data)}
                            keyboardType={"number-pad"}
                            placeholder="Height"
                            style={styles.inputStyle} />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{ width: "48%" }}>
                        <Text title={`Photo length`} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
                        <Input
                            value={length}
                            onChangeText={data => setLength(data)}
                            keyboardType={"number-pad"}
                            placeholder="Length"
                            returnKeyType="next"
                            style={styles.inputStyle} />
                    </View>
                    <View style={{ width: "48%" }}>
                        <Text title={`Photo weight`} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
                        <Input
                            value={weight}
                            onChangeText={data => setWeight(data)}
                            keyboardType={"number-pad"}
                            placeholder="Weight"
                            style={styles.inputStyle} />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{ width: "48%" }}>
                        <Text title={`Weight tpye(KG)`} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
                        <Input
                            value={weightType}
                            onChangeText={data => console.log(data)}
                            keyboardType={"default"}
                            placeholder="Weight Type(KG)"
                            returnKeyType="next"
                            style={styles.inputStyle} />
                    </View>
                    <View style={{ width: "48%" }}>
                        <Text title={`Final price`} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
                        <Input
                            value={price}
                            onChangeText={data => setPrice(data)}
                            keyboardType={"number-pad"}
                            placeholder="Price"
                            style={styles.inputStyle} />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    {renderOptions("Portrait", "PORTRAIT")}
                    {renderOptions("Landscape", "LANDSCAPE")}
                    {renderOptions("Square", "SQUARE")}
                </View>
                {renderItems()}
                <Button title={"Save"} loader={btnLoader} onPress={() => submitSizeData()} style={[styles.buttonStyle]} textStyle={{ color: COLOUR.WHITE }} />
            </KeyboardAvoidingView>
            <Modal visible={showErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to load the service. Connectivity issue is there. Please press try again button to load again."
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setErrorComponent(false);
                    }}
                    icon={failure} />
            </Modal>
            <Modal visible={showNetErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to connect. Please check your internet and try again"
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setNetErrorComponent(false);
                    }}
                    icon={net_failure} />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.LIGHTBG
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLOUR.BACKGROUND
    },
    inputContainer: {
        width: "95%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        alignSelf: "center"
    },
    inputStyle: {
        width: "100%"
    },
    itemContainer: {
        width: "95%",
        padding: 10,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        alignSelf: "center",
        borderBottomWidth: 1,
        borderBottomColor: COLOUR.GRAY,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemBtnContainer: {
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    buttonStyle: {
        marginTop: 10,
        width: "95%",
        alignSelf: "center"
    },
    optionContainer: {
        padding: 5,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    }
})