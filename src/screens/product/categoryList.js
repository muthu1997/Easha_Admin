import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image, Modal } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { storeCategory } from "../../../redux/actions";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";

export default function Success(props) {
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const PID = props.route.params.PID;

    const categoryList = useSelector(state => state.categoryList)

    useEffect(() => {
        getCategoryList();
    }, [])

    const getCategoryList = async () => {
        if (await isInternetConnection()) {
            dispatch(storeCategory(PID)).then(res => {
                setLoading(false);
            }).catch(error => {
                setLoading(false);
                setErrorComponent(true);
            })
        } else {
            setNetErrorComponent(true);
        }
    }
    const renderIconButton = (icon, colour, item) => {
        return (
            <TouchableOpacity onPress={() => props.navigation.navigate("AddCategory", { type: "edit", data: item })} style={[styles.iconButton, { backgroundColor: colour }]}>
                <Icon name={icon} size={15} color={COLOUR.WHITE} />
            </TouchableOpacity>
        )
    }
    const renderCard = item => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.navigate("productlist", {catId: item._id, title: item.name})} style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                </View>
                <View style={styles.dataContainer}>
                    <View>
                        <Text type="paragraph" title={item.name} style={{ color: COLOUR.WHITE }} />
                    </View>
                </View>

                <View style={{ height: 30, flexDirection: "row", alignItems: "center", position: "absolute", top: 5, right: 5 }}>
                    {renderIconButton("pencil", COLOUR.CYON, item)}
                </View>
            </TouchableOpacity>
        )
    }
    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <View style={styles.container}>
            <Header
                title="Product categories"
                rightIcon="plus-circle"
                back
                onBackPress={()=>props.navigation.goBack()}
                onRightButtonPress={() => props.navigation.navigate("AddCategory", { type: "add" })}
            />
            <View style={styles.mainContainer}>
                <FlatList
                    data={categoryList}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    ListHeaderComponent={() => {
                        return <View style={styles.headOptionsContainer}>
                        <Text type="label" title={`Total ${categoryList.length} categories`} />
                        </View>
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            renderCard(item)
                        )
                    }}
                    keyExtractor={(item, index) => (item._id + index)} />
            </View>
            <Modal visible={showErrorComponent}>
                <FailureComponent
                    errtitle="Oooops!"
                    errdescription="Unable to load the service. Connectivity issue is there. Please press try again button to load again."
                    positiveTitle="Try again"
                    onPressPositive={() => {
                        setLoading(true);
                        getCategoryList();
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
                        getCategoryList();
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
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center"
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
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    headOptionsContainer: {
        width: "100%",
        height: 80,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})