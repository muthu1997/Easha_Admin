import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated, Image, ColorPropType } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { account } from "../../../constants/icons";
import Text from "../../../component/text";
import Button from "../../../component/button";
import GrpButton from "../../../component/groupBtn";
import Input from "../../../component/inputBox";
import { TouchableOpacity } from "react-native-gesture-handler";
const { width } = Dimensions.get("screen")

export default function Success(props) {
    const carHider = useRef(new Animated.Value(1)).current;
    const editHider = useRef(new Animated.Value(1)).current;
    const [profileView, setProfileView] = useState(1);
    let options = [{title: "Individual"}, {title:"Company"}]
    const renderOptions = (title, description) => {
        return (
            <View style={styles.optionContainer}>
                <Text type="paragraph" title={title} />
                <Text type="paragraph" title={description} style={{ color: COLOUR.DARK_GRAY }} />
            </View>
        )
    }

    const editFunction = () => {
        setTimeout(() => {
            setProfileView(2)
            Animated.timing(editHider, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }).start()
        }, 1500)
        Animated.timing(carHider, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
        }).start()
    }

    const submitFunction = () => {
        setTimeout(() => {
            setProfileView(1)
            Animated.timing(carHider, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }).start()
        }, 1500)
        Animated.timing(editHider, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
        }).start()
    }

    return (
        <View style={styles.container}>
            <Header
                back
                title="Profile"
            />
            <View style={[styles.mainContainer]}>
                {profileView === 1 ?
                    <Animated.View style={[styles.profileContainer, { opacity: carHider }]}>
                        <View style={styles.profileImageContainer}>
                            <View style={styles.imageContainer}>
                                <Image source={account} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                            </View>
                        </View>
                        <Text type="heading" title={"Muthukumar"} />
                        <Text type="paragraph" title={"7867926344"} style={{ color: COLOUR.DARK_GRAY }} />
                        <Text type="paragraph" title={"19smkumar97@gmail.com"} style={{ color: COLOUR.DARK_GRAY, marginBottom: 20 }} />
                        {renderOptions("Account type", "Individual")}
                        <Button title="Edit" onPress={() => editFunction()} style={{ position: "absolute", bottom: 10 }} />
                    </Animated.View>
                    :
                    <Animated.View style={[styles.profileContainer, { opacity: editHider }]}>
                        <View style={styles.profileImageContainer}>
                            <TouchableOpacity style={styles.imageContainer}>
                                <Image source={account} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                        <Input
                            // value={mobile}
                            onChangeText={data => console.log(data)}
                            style={{width: "80%"}}
                            placeholder="User Name" />
                             <Input
                            // value={mobile}
                            onChangeText={data => console.log(data)}
                            style={{width: "80%"}}
                            placeholder="Email Id" />
                            <View style={{flexDirection:"row", marginTop:5}}>
                            {options.map(item => {
                                return <TouchableOpacity activeOpacity={0.8} key={item} style={styles.grpButton}>
                                <Text type="label" title={item.title} style={{color: COLOUR.PRIMARY}} />
                                </TouchableOpacity>
                            })}
                            </View>
                        <Button title="Submit" onPress={() => submitFunction()} style={{ position: "absolute", bottom: 10 }} />
                    </Animated.View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.LIGHTBG,
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center"
    },
    profileContainer: {
        width: "90%",
        backgroundColor: COLOUR.WHITE,
        borderRadius: 20,
        alignItems: 'center'
    },
    profileImageContainer: {
        width: "100%",
        height: "40%",
        alignItems: "center",
        justifyContent: "center"
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLOUR.PRIMARY,
        overflow: "hidden"
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
        alignItems:"center",
        justifyContent:"center",
        borderWidth: 1,
        margin: 5
    }
})