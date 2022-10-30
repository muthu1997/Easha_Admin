import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image, ActivityIndicator, Alert } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { check } from "../../../constants/icons";
import Text from "../../../component/text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../component/button";
const { width } = Dimensions.get("screen")
import { getMethod, deleteMethod } from "../../../function"
import { TouchableOpacity } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import GroupBtn from "../../../component/groupBtn";

export default function Success(props) {
    const [product, setProduct] = useState([]);
    const [loader, setLoader] = useState(true);
    const [getSelectedProduct, setSelectedProduct] = useState("");
    const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);
    const [selectedCat, setCat] = useState("");
    const [categoryList, setCatList] = useState([]);
    const refRBSheet = useRef();

    useEffect(() => {
        getCategoryList();
    }, [])

    const getCategoryList = () => {
        setLoader(true)
        getMethod('categoryname/list', res => {
            if (res !== "error") {
                setCat(res.data[0]);
                setCatList(res.data);
                getProductList(res.data[0]._id);
            } else {
                alert("Problem while getting categories")
            }
        })
    }

    const getProductList = (id) => {
        setLoader(true)
        getMethod(`product/listbycatid/${id}`, res => {
            if (res !== "error") {
                setProduct(res.data);
            } else {
                alert("Problem while getting product")
            }
            setLoader(false)
        })
    }

    const deleteProduct = () => {
        setDeleteBtnLoader(true)
        deleteMethod(`product/${getSelectedProduct._id}`, response => {
            refRBSheet.current.close()
            if (response !== "error") {
                let id = categoryList[0]._id;
                getProductList(id);
            } else {
                alert("Something went wrong. please try again later.")
            }
            setDeleteBtnLoader(false)
        })
    }

    const renderIconButton = (icon, colour, item) => {
        return (
            <TouchableOpacity onPress={() => {
                setSelectedProduct(item)
                if (icon === "delete") {
                    refRBSheet.current.open()
                }else {
                    props.navigation.navigate("EditProduct", {data: item, categoryList: categoryList});
                }
            }} style={[styles.iconButton, { backgroundColor: colour }]}>
                <Icon name={icon} size={15} color={COLOUR.WHITE} />
            </TouchableOpacity>
        )
    }
    const renderCard = item => {
        return (
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                </View>
                <View style={styles.dataContainer}>
                    <View>
                        <Text type="heading" title={item.name} />
                        <Text type="paragraph" title={item.description} lines={2} style={{ color: COLOUR.DARK_GRAY, fontWeight: "500" }} />
                    </View>
                    <View style={{ height: 30, alignSelf: "flex-end", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Text type="heading" title={`Rs ${item.price}`} style={{ color: COLOUR.PRIMARY, marginRight: 10 }} />
                        {renderIconButton("pencil", COLOUR.GREEN, item)}
                        {renderIconButton("delete", COLOUR.RED, item)}
                    </View>
                </View>
            </View>
        )
    }

    const renderDeleteAlert = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text type="heading" title={"Are you sure, want to delete this product?"} style={{ color: COLOUR.PRIMARY, fontWeight: "500" }} />
                <View style={{ flexDirection: "row", marginTop: 25 }}>
                    <Button onPress={() => deleteProduct()} title="Delete" loader={deleteBtnLoader} style={{ width: "40%", margin: 5, backgroundColor: COLOUR.RED }} />
                    <Button onPress={() => refRBSheet.current.close()} title="Cancel" style={{ width: "40%", margin: 5 }} />
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Header
                back
                title="Esha Arts"
                rightIcon="plus-circle"
                onRightButtonPress={() => props.navigation.navigate("NewProduct", {categoryList: categoryList})}
            />
                <View style={styles.mainContainer}>
                    {categoryList.length > 0 ? <GroupBtn
                        onChangeText={(data) => {
                            getProductList(data._id)
                        }}
                        mainData={categoryList} /> : null }
                        {loader ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator color={COLOUR.PRIMARY} size="large" /> 
                    </View> :
                    <FlatList
                        data={product}
                        renderItem={({ item, index }) => {
                            return (
                                renderCard(item)
                            )
                        }}
                        ListEmptyComponent={() => {
                            return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text type="heading" title={"No products found."} style={{ color: COLOUR.DARK_GRAY, fontWeight: "500" }} />
                            </View>
                        }}
                        keyExtractor={item => item._id} /> }
                </View>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                {renderDeleteAlert()}
            </RBSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
    },
    cardContainer: {
        width: "90%",
        padding: 10,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
        marginTop: 10,
        alignSelf: "center"
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 5,
        overflow: "hidden"
    },
    itemImage: {
        width: "100%",
        height: "100%"
    },
    dataContainer: {
        width: "85%",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        overflow: "hidden"
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
        marginHorizontal: 5
    }
})