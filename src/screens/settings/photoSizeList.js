import React, {useEffect, useState} from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Title from "../../../component/titleContainer";
import Text from "../../../component/text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { storeSizeList } from "../../../redux/actions";
import { deleteMethod } from "../../../utils/function"
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";

export default function SizeList(props) {
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const productSizeList = useSelector(state => state.productSize)

    useEffect(() => {
        getSizeList();
    }, [])

    const getSizeList = async () => {
        if (await isInternetConnection()) {
            dispatch(storeSizeList()).then(res => {
                setLoading(false);
            }).catch(error => {
                setLoading(false);
                setErrorComponent(true);
            })
        } else {
            setNetErrorComponent(true);
        }
    }

    async function deleteSizeData(selectedItemID) {
        Alert.alert("Are you sure!", "Want to delete this item?", [
            {
                text: "DELETE",
                onPress: () => {
                    deleteMethod(`size/${selectedItemID}`).then(response => {
                        dispatch(storeSizeList());
                    }).catch(error => {
                        ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
                    })
                }
            },
            {
                text: "CANCEL"
            }
        ])
    }

    const renderIconButton = (icon, colour, item, btntype) => {
        return (
            <TouchableOpacity onPress={() => {
                if(btntype === "DELETE") {
                    deleteSizeData(item._id)
                }else {
                    props.navigation.navigate("EditSize", {data: item})
                }
            }} style={[styles.iconButton, { backgroundColor: colour }]}>
                <Icon name={icon} size={15} color={COLOUR.WHITE} />
            </TouchableOpacity>
        )
    }
    function renderItems(item, index, data) {
        return (
            item?.size_type === data ? <View style={styles.itemContainer}>
                <View style={{ width: "100%" }}>
                    <Text title={`${item.size_title}`} type="paragraph" style={{ color: COLOUR.ORANGE_DARK }} />
                    <View style={styles.itemBtnContainer}>
                        <Text title={`${item.weight}${item.weight_type} `} type="paragraph" style={{ color: COLOUR.PRIMARY }} />
                        <Text title={`Rs.${item.price}`} type="paragraph" style={{ color: COLOUR.DARK_GRAY }} />
                        <View style={{flexDirection: "row"}}>
                        {renderIconButton("pencil", COLOUR.CYON, item, "EDIT")}
                        {renderIconButton("trash-can-outline", COLOUR.RED, item, "DELETE")}
                        </View>
                    </View>
                </View>
            </View> : null
        )
    }

    function listContainer(data) {
        return <FlatList
            data={productSizeList}
            renderItem={({ item, index }) => {
                return renderItems(item, index, data);
            }}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false} />
    }
    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <View style={styles.container}>
            <Header
                title="Photo Size"
                back
                onBackPress={() => props.navigation.goBack()}
                rightIcon="plus-circle"
                onRightButtonPress={() => props.navigation.navigate("AddSize")}
            />
            <View style={styles.mainContainer}>
                <FlatList
                    data={productSizeList}
                    renderItem={({ item, index }) => {
                        return <View>
                            {renderItems(item, index, "LANDSCAPE")}
                        </View>
                    }}
                    keyExtractor={item => item._id}
                    ListHeaderComponent={() => {
                        return productSizeList?.find(x => x.size_type === "PORTRAIT") ? <View>
                            <Title title="Portrait" />
                            {listContainer("PORTRAIT")}
                            {productSizeList?.find(x => x.size_type === "LANDSCAPE") ? <Title title="Landscape" /> : null}
                        </View> : null
                    }}
                    ListFooterComponent={() => {
                        return productSizeList?.find(x => x.size_type === "SQUARE") ? <View>
                            <Title title="Square" />
                            {listContainer("SQUARE")}
                        </View> : null
                    }}
                    showsVerticalScrollIndicator={false} />
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
        flex: 1,
        backgroundColor: COLOUR.LIGHTBG
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLOUR.BACKGROUND
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
        flex: 1,
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
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
        alignItems:"center",
        justifyContent: "center"
    }
})