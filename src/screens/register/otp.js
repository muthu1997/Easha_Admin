import React, { useState, useRef } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { technecian } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import OTPInputView from '@twotalltotems/react-native-otp-input'

export default function OTPFunction(props) {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const otpInput = useRef(null);

    const setOTPText = () => {
        otpInput.current.setValue("1234");
    }

    const clearOTPText = () => {
        otpInput.current.clear();
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle="dark-content" />
            <View style={styles.headingContainer}>
                <Text title="Verify" type="title" style={{ fontSize: 28 }} />
                <Text title="Account!" type="title" style={{ fontSize: 28 }} />
                <Text title="Enter 4-digit verification code we have sent to at" type="paragraph" style={{ marginTop: 20 }} />
                <Text title="7867926344" type="paragraph" style={{ color: COLOUR.PRIMARY }} />
            </View>
            <View style={styles.formContainer}>
                <OTPInputView
                    style={styles.otpInput}
                    pinCount={4}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    // onCodeChanged = {code => { this.setState({code})}}
                    autoFocusOnLoad
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled={(code => {
                        console.log(`Code is ${code}, you are good to go!`)
                    })}
                />

                <Button title="Continue" onPress={() => props.navigation.navigate("RegSuccess")} style={[styles.buttonStyle, { marginTop: 35 }]} textStyle={{ color: COLOUR.WHITE }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: COLOUR.WHITE,
        paddingHorizontal: '10%'
    },
    mainIcon: {
        width: 80,
        height: 80
    },
    buttonStyle: {
        marginTop: 10,
        width: "100%"
    },
    headingContainer: {
        width: "100%",
        position: 'absolute',
        top: "10%"
    },
    formContainer: {
        width: '100%',
        marginTop: '20%',
        alignItems: 'center'
    },
    otpInput: {
        width: '80%', 
        height: 200
    },
    underlineStyleBase: {
        backgroundColor: COLOUR.LIGHTGRAY,
        borderRadius: 10,
        width: 55,
        height: 55
    },
    underlineStyleHighLighted: {
        backgroundColor: COLOUR.CYON_LIGHT,
        borderRadius: 10
    }
})