import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, StatusBar, Animated, Image } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { google, facebook } from "../../../constants/icons";
import Text from "../../../component/text";
import Header from "../../../component/header";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import MainContainer from "../../../component/mainContainer";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Corousal(props) {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const headingAnimator = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        enableTitle();
    },[])

    const enableTitle = () => {
        Animated.timing(headingAnimator, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        }).start()
    }

    const renderSocialButton = (img) => {
        return (
            <TouchableOpacity style={styles.socialButton}>
                <Image style={styles.socialImage} source={img} resizeMode="contain" />
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.LIGHTBG} barStyle="dark-content" />
            <Header signin />
            <View style={styles.mainContainer}>
                <Animated.View style={[styles.titleContainer, {opacity: headingAnimator}]}>
                    <Text title={`Here To Get\nWelcome!`} type="title" />
                </Animated.View>
                <View style={styles.formContainer}>
                <Input
                value={mobile}
                onChangeText={data=> console.log(data)}
                keyboardType="number-pad"
                placeholder="Phone number" />
                <Input
                value={password}
                onChangeText={data=> console.log(data)}
                keyboardType={"default"}
                secureTextEntry={true}
                placeholder="Password" />
                <Button title="Sign In" onPress={() => props.navigation.navigate("HomeScreen")} style={[styles.buttonStyle, {marginTop: 35}]} textStyle={{ color: COLOUR.WHITE }} />
                <View style={{flexDirection: "row"}}>
                <Text onPress={() => props.navigation.navigate("Signup")} title="Don't have an account? " type="paragraph" style={{ marginVertical: 20 }} />
                <Text onPress={() => props.navigation.navigate("Signup")} title="Sign up" type="paragraph" style={{ marginVertical: 20, color: COLOUR.PRIMARY }} />
                </View>
                </View>
                <View style={[styles.socialContainer]}>
                <Text onPress={() => props.navigation.navigate("Signup")} title="Or sign in with" type="paragraph" style={{ color: COLOUR.PRIMARY }} />
                <View style={{flexDirection: "row", marginBottom: 50}}>
                    {renderSocialButton(google)}
                    {renderSocialButton(facebook)}
                </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.LIGHTBG
    },
    mainIcon: {
        width: 80,
        height: 80
    },
    buttonStyle: {
        marginTop: 10,
        width: "40%"
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLOUR.WHITE,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 20
    },
    titleContainer: {
        width: "100%",
        height: "30%",
        justifyContent: "center",
        paddingLeft: 20
    },
    socialContainer: {
        width: "100%",
        paddingHorizontal: 20,
        position: "absolute",
        bottom: 0,
        paddingBottom: 10
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 35,
        backgroundColor: COLOUR.WHITE,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        marginVertical: 10,
        marginRight: 10
    },
    socialImage: {
        width: "75%",
        height: "75%"
    }
})