import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { technecian } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { Checkbox } from 'react-native-paper';

export default function SignupFunction(props) {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [checked, setChecked] = React.useState(false);
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle="dark-content" />
            <View style={styles.headingContainer}>
                <Text title="Welcome!" type="title" style={{ fontSize: 28 }} />
                <Text title="Please provide following details for your new account" type="label" style={{ marginVertical: 20, textAlign: "center", width: "70%" }} />
            </View>
            <View style={styles.formContainer}>
                <Input
                    value={password}
                    onChangeText={data => console.log(data)}
                    keyboardType={"default"}
                    placeholder="Full Name" />
                <Input
                    value={mobile}
                    onChangeText={data => console.log(data)}
                    keyboardType="number-pad"
                    placeholder="Mobile Number" />
                <Input
                    value={password}
                    onChangeText={data => console.log(data)}
                    keyboardType={"default"}
                    placeholder="Email Address" />
                <Input
                    value={password}
                    onChangeText={data => console.log(data)}
                    keyboardType={"default"}
                    secureTextEntry={true}
                    placeholder="Password" />
                    <View style={styles.termsContainer}>
                <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    color={COLOUR.PRIMARY}
                    onPress={() => {
                        setChecked(!checked);
                    }}
                />
                <Text title="By creating the account you have to agree with our Terms and Conditions." type="paragraph" style={{width: "90%"}} />
                    </View>
                <Button title="Sign up my account" onPress={() => props.navigation.navigate("OTP")} style={[styles.buttonStyle]} textStyle={{ color: COLOUR.WHITE }} />
                <Button title="Sign up with Google" onPress={() => props.navigation.navigate("Corousal")} style={[styles.buttonStyle, { backgroundColor: COLOUR.BLACK }]} textStyle={{ color: COLOUR.WHITE }} />
                <Text title="Already have an account? Sign in" onPress={() => props.navigation.navigate("Login")} type="label" style={{ marginVertical: 20 }} />
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
        top: "10%",
        alignItems: 'center'
    },
    formContainer: {
        width: '100%',
        marginTop: '20%',
        alignItems: 'center'
    },
    termsContainer: {
        width: "100%",
        height: 40,
        marginTop: 15,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-start"
    }
})