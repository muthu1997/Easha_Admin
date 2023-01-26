import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, ToastAndroid, Modal, Alert } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../component/button";
const { width } = Dimensions.get("screen")
import { putMethod } from "../../../utils/function"
import { TouchableOpacity } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import Input from "../../../component/inputBox";
import { setDeliveryList } from "../../../redux/actions";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";

export default function DeliveryList(props) {
    const [btnLoader, setBtnLoader] = useState(false);
    const [getSelectedProduct, setSelectedProduct] = useState("");
    const [amount, setAmount] = useState(0);
    const [tnAmount, setTNAmount] = useState(0);
    const [niAmount, setNIAmount] = useState(0);
    const refRBSheet = useRef();
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const deliveryList = useSelector(state => state.deliveryList)

    useEffect(() => {
        // if (deliveryList.length === 0) {
            getCountryList();
        // } else {
        //     setLoading(false);
        // }
    }, [])

    const getCountryList = async () => {
        if (await isInternetConnection()) {
            dispatch(setDeliveryList()).then(res => {
                console.log(res[0].states)
                setLoading(false);
            }).catch(error => {
                setLoading(false);
                setErrorComponent(true);
            })
        } else {
            setNetErrorComponent(true);
        }
    }

    const updateFees = () => {
        if (!btnLoader) {
            setBtnLoader(true);
            let body;
            if(getSelectedProduct.country === "India") {
                body = {
                    "TN": Number(tnAmount),
                    "NI": Number(niAmount)
                }
            }else {
                body = {
                    "fees": Number(amount)
                }
            }
            console.log(body)
            putMethod(`delivery/${getSelectedProduct._id}`, body).then(res => {
                if (res !== -1) {
                    getCountryList();
                    setBtnLoader(false);
                    refRBSheet.current.close();
                } else {
                    ToastAndroid.show("Problem while updating delivery charge", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
                    setBtnLoader(false);
                }
            }).catch(error => {
                ToastAndroid.show("Something went wrong, please try again later.", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
            })
        } else {
            ToastAndroid.show("Update process is going please wait.", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
        }
    }

    const renderIconButton = (icon, colour, item) => {
        return (
            <TouchableOpacity onPress={() => {
                setSelectedProduct(item)
                if (item.country !== "India") {
                    setAmount(String(item.fees))
                } else {
                    setTNAmount(String(item.TN))
                    setNIAmount(String(item.NI))
                }
                refRBSheet.current.open()
            }} style={[styles.iconButton, { backgroundColor: colour }]}>
                <Icon name={icon} size={15} color={COLOUR.WHITE} />
            </TouchableOpacity>
        )
    }
    const renderCard = item => {
        return (
            <View style={styles.cardContainer}>
                <View style={styles.dataContainer}>
                    <View style={{ width: "80%" }}>
                        <Text type="label" title={item.country} />
                        {item.country !== "India" ? <Text type="label" title={`Rs ${item.fees}`} style={{ color: COLOUR.PRIMARY, marginRight: 10 }} /> : null}
                        {item.country === "India" ? <Text type="label" title={`For TN Rs ${item.TN}`} style={{ color: COLOUR.PRIMARY, marginRight: 10 }} /> : null}
                        {item.country === "India" ? <Text type="label" title={`For NI Rs ${item.NI}`} style={{ color: COLOUR.PRIMARY, marginRight: 10 }} /> : null}
                    </View>
                    <View style={{ height: 30, width: "20%", alignSelf: "flex-end", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        {renderIconButton("pencil", COLOUR.GREEN, item)}
                    </View>
                </View>
            </View>
        )
    }

    const renderDeleteAlert = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text type="label" title={`Update delivery charge for ${getSelectedProduct.country}`} style={{ color: COLOUR.PRIMARY, fontWeight: "500", textAlign: "center" }} />
                {getSelectedProduct.country !== "India" ? <Input
                    style={{ width: "85%" }}
                    value={amount}
                    onChangeText={data => setAmount(data)}
                    keyboardType={"number-pad"}
                    placeholder="Delivery fees" /> :
                    <View style={{width: "100%", alignItems:"center"}}>
                        <Input
                            style={{ width: "85%" }}
                            value={tnAmount}
                            onChangeText={data => setTNAmount(data)}
                            keyboardType={"number-pad"}
                            placeholder="TN fees" />
                        <Input
                            style={{ width: "85%" }}
                            value={niAmount}
                            onChangeText={data => setNIAmount(data)}
                            keyboardType={"number-pad"}
                            placeholder="NI fees" />
                    </View>}
                <View style={{ flexDirection: "row", marginTop: 25 }}>
                    <Button onPress={() => updateFees()} title="Update" loader={btnLoader} style={{ width: "40%", margin: 5, backgroundColor: COLOUR.RED }} />
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
                title="Delivery charges"
                onBackPress={() => props.navigation.goBack()}
            />
            <View style={styles.mainContainer}>
                <View>
                    <FlatList
                        data={deliveryList}
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
                        keyExtractor={item => item._id} />
                </View>
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
                        getCountryList();
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
                        getCountryList();
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
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        overflow: "hidden",
        flexDirection: "row"
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
        width: 25,
        height: 25,
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
})