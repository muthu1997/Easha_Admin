import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image, ActivityIndicator } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { check } from "../../../constants/icons";
import Text from "../../../component/text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../component/button";
const { width } = Dimensions.get("screen")
import { Products } from "../../../dummy";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getMethod } from "../../../function"

export default function Success(props) {
    const [category, setCategory] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        getCategoryList();
    }, [])

    const getCategoryList = () => {
        setLoader(true)
        getMethod('category/list', res => {
            if (res !== "error") {
                setCategory(res.data);
            } else {
                alert("Problem while getting categories")
            }
            setLoader(false)
        })
    }
    const renderIconButton = (icon, colour, item) => {
        return (
            <TouchableOpacity onPress={() => props.navigation.navigate("AddCategory",{type: "edit", data: item})} style={[styles.iconButton, { backgroundColor: colour }]}>
                <Icon name={icon} size={15} color={COLOUR.WHITE} />
            </TouchableOpacity>
        )
    }
    const renderCard = item => {
        return (
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                </View>
                <View style={styles.dataContainer}>
                    <View>
                        <Text type="paragraph" title={item.name} style={{ color: COLOUR.WHITE }} />
                    </View>
                </View>

                <View style={{ height: 30, flexDirection: "row", alignItems: "center", position: "absolute", top: 5, right: 5 }}>
                    {renderIconButton("pencil", COLOUR.GREEN, item)}
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Header
                back
                onBackPress={() => props.navigation.goBack()}
                title="Categories"
                rightIcon="plus-circle"
                onRightButtonPress={() => props.navigation.navigate("AddCategory",{type: "add"})}
            />
            {loader ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={COLOUR.PRIMARY} size="large" />
            </View> :
                <View style={styles.mainContainer}>
                    <FlatList
                        data={category}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        ListHeaderComponent={() => {
                            return <TouchableOpacity onPress={() => getCategoryList()} style={{ width: "50%", height: 40, alignItems: "center", justifyContent: "center", backgroundColor: COLOUR.SECONDARY, borderRadius: 10, alignSelf: "center", marginTop: 10 }}>
                                <Text type="paragraph" title={"Refresh"} style={{ color: COLOUR.WHITE }} />
                            </TouchableOpacity>
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                renderCard(item)
                            )
                        }}
                        keyExtractor={(item, index) => (item._id+index)} />
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
        alignItems: "center"
    },
    cardContainer: {
        width: Dimensions.get("screen").width / 2.5,
        height: Dimensions.get("screen").width / 2.5,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        marginTop: 10,
        alignSelf: "center",
        margin: 5,
        overflow: "hidden"
    },
    imageContainer: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
        overflow: "hidden",
        position: "absolute"
    },
    itemImage: {
        width: "100%",
        height: "100%"
    },
    dataContainer: {
        width: "100%",
        justifyContent: "center",
        padding: 5,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    statusContainer: {
        width: "30%",
        height: 30,
        backgroundColor: COLOUR.CARD_BG,
        position: "absolute",
        top: -30,
        right: 0,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    iconButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOUR.PRIMARY,
        marginRight: 5
    }
})