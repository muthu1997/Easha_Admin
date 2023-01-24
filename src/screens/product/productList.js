import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image, Modal, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../component/button";
const { width } = Dimensions.get("screen")
import { getMethod, deleteMethod } from "../../../utils/function"
import { TouchableOpacity } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import GroupBtn from "../../../component/groupBtn";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";
import { storeCategoryProduct } from "../../../redux/actions";

export default function ProductList(props) {
    const [getSelectedProduct, setSelectedProduct] = useState("");
    const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);
    const [categoryList, setCatList] = useState([]);
    const refRBSheet = useRef();
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const catProductList = useSelector(state => state.catProductList)

    useEffect(() => {
        getProductList(props.route.params.catId);
    }, [])

    const getProductList = (id) => {
        setLoading(true)
        dispatch(storeCategoryProduct(id)).then(res => {
            setLoading(false);
        }).catch(error => {
            ToastAndroid.show("Something went wrong. please go back and try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG);
            setLoading(false);
        })
    }

    const deleteProduct = () => {
        setDeleteBtnLoader(true)
        deleteMethod(`product/${getSelectedProduct._id}`).then(response => {
            refRBSheet.current.close()
            if (response !== -1) {
                getProductList(props.route.params.catId);
            } else {
                ToastAndroid.show("Something went wrong. please go back and try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG);
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
                } else {
                    props.navigation.navigate("EditProduct", { data: item, categoryList: categoryList });
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
                    <Image source={{ uri: item.image[0].image }} style={styles.itemImage} resizeMode="contain" />
                </View>
                <View style={styles.dataContainer}>
                    <View style={{width: "100%"}}>
                        <Text type="label" title={item.name} />
                        <Text type="hint" title={item.description} lines={2} style={{ color: COLOUR.DARK_GRAY, fontWeight: "500" }} />
                    </View>
                    <View style={{ height: 40, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{flexDirection: "row"}}>
                            <View style={[styles.premiumContainer,{backgroundColor: item.isPremium ? COLOUR.GOLD : COLOUR.PRIMARY}]} />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            {renderIconButton("pencil", COLOUR.GREEN, item)}
                            {renderIconButton("delete", COLOUR.RED, item)}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const renderDeleteAlert = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text type="label" title={"Are you sure, want to delete this product?"} style={{ color: COLOUR.PRIMARY, fontWeight: "500" }} />
                <View style={{ flexDirection: "row", marginTop: 25 }}>
                    <Button onPress={() => deleteProduct()} title="Delete" loader={deleteBtnLoader} style={{ width: "40%", margin: 5, backgroundColor: COLOUR.RED }} />
                    <Button onPress={() => refRBSheet.current.close()} title="Cancel" style={{ width: "40%", margin: 5 }} />
                </View>
            </View>
        )
    }
    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <View style={styles.container}>
            <Header
                back
                title={props.route.params.title}
                rightIcon="plus-circle"
                onBackPress={() => props.navigation.goBack()}
                onRightButtonPress={() => props.navigation.navigate("NewProduct", { catId: props.route.params.catId })}
            />
            <View style={styles.mainContainer}>
                <FlatList
                    data={catProductList}
                    renderItem={({ item, index }) => {
                        return (
                            renderCard(item)
                        )
                    }}
                    ListEmptyComponent={() => {
                        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Text type="label" title={"No products found."} style={{ color: COLOUR.DARK_GRAY, fontWeight: "500" }} />
                        </View>
                    }}
                    keyExtractor={(item) => item._id} />
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
            <Modal visible={showErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to load the service. Connectivity issue is there. Please press try again button to load again."
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setLoading(true);
                        getProductList(props.route.params.catId);
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
                        setLoading(true);
                        getProductList(props.route.params.catId);
                        setNetErrorComponent(false);
                    }}
                    icon={net_failure} />
            </Modal>
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
        width: 100,
        height: 100,
        borderRadius: 5,
        overflow: "hidden"
    },
    itemImage: {
        width: "100%",
        height: "100%"
    },
    dataContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
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
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    premiumContainer: {
        width: 10,
        height: 10,
        borderRadius: 5
    }
})