import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated, Image, StatusBar } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { feedback_background, f1, f11, f2, f22, f3, f33, f4, f44 } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";
import GrpButton from "../../../component/groupBtn";
import Input from "../../../component/inputBox";
import { TouchableOpacity } from "react-native-gesture-handler";
const { width } = Dimensions.get("screen")

const feedOptions = [
    {
        id: 1,
        img1: f1,
        img2: f11
    },
    {
        id: 2,
        img1: f2,
        img2: f22
    },
    {
        id: 3,
        img1: f3,
        img2: f33
    },
    {
        id: 4,
        img1: f4,
        img2: f44
    }
]
export default function Feedback(props) {
    const [getSelectedId, setSelectedId] = useState(0);
    const rateFunction = (id) => {
        setSelectedId(id)
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} />
            <Header
                back
                title="Feedback"
                style={{backgroundColor: COLOUR.WHITE}}
            />

            <View style={[styles.mainContainer]}>

                <View style={styles.imageContainer}>
                    <Image source={feedback_background} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
                <View elevation={3} style={[styles.profileContainer]}>
                    <View style={styles.profileImageContainer}>
                        <Text type="heading" title={"Please rate your experience"} />
                        <View style={{flexDirection:"row", marginVertical: 15}}>
                        {feedOptions.map(item => {
                            return (
                                <TouchableOpacity onPress={() => rateFunction(item.id)} style={[styles.iconButton, {backgroundColor: getSelectedId === item.id ? COLOUR.PRIMARY : COLOUR.WHITE}]} activeOpacity={0.9}>
                                <Image source={getSelectedId === item.id ? item.img2 : item.img1} style={{ width: 35, height: 35 }} resizeMode="contain" />
                                </TouchableOpacity>
                            )
                        })}
                        </View>
                        <Text type="heading" title={"Additional comment"} />
                        <Input
                        multiline={true}
                        placeholder="Your comment here..."
                        style={styles.commentInput} />
                    </View>
                    <Button title="Submit" onPress={() => editFunction()} style={{ marginBottom: 10 }} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE,
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center'
    },
    profileContainer: {
        width: "90%",
        backgroundColor: COLOUR.WHITE,
        borderRadius: 20,
        alignItems: 'center',
        position: "absolute",
        bottom: 20
    },
    profileImageContainer: {
        width: "100%",
        padding: 10,
        justifyContent: "center"
    },
    imageContainer: {
        width: "60%",
        height: "30%",
        marginTop: "15%"
    },
    optionContainer: {
        width: "90%",
        height: 40,
        borderBottomWidth: 1,
        marginVertical: 5,
        borderBottomColor: COLOUR.DARK_GRAY,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    grpButton: {
        padding: 5,
        borderColor: COLOUR.PRIMARY,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        margin: 5
    },
    iconButton: {
        padding: 5,
        borderRadius: 5,
        margin: 5,
        backgroundColor: COLOUR.WHITE,
        elevation: 1
    },
    commentInput: {
        backgroundColor: COLOUR.LIGHTGRAY,
        borderRadius: 10,
        height: 150,
        borderBottomWidth: 0,
        alignItems: "flex-start",
        textAlignVertical: "top"
    }
})