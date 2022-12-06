import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, FlatList, Image, ActivityIndicator, Alert } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import { check } from "../../../constants/icons";
import Text from "../../../component/text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../../component/button";
const { width } = Dimensions.get("screen")
import { getMethod, deleteMethod, putMethod } from "../../../utils/function"
import { TouchableOpacity } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import Input from "../../../component/inputBox";

export default function DeliveryList(props) {
    const [btnLoader, setBtnLoader] = useState(false);
    const [loader, setLoader] = useState(true);
    const [getSelectedProduct, setSelectedProduct] = useState("");
    const [country, setCountry] = useState("");
    const [amount, setAmount] = useState(0);
    const [countryList, setCountryList] = useState([]);
    const refRBSheet = useRef();

    useEffect(() => {
        getCountryList();
    }, [])

    const getCountryList = () => {
        setLoader(true)
        getMethod('delivery/list/all', res => {
            if (res !== "error") {
                setCountryList(res.data);
                setLoader(false);
            } else {
                alert("Problem while getting country")
                setLoader(false);
            }
        })
    }

    const updateFees = () => {
        setBtnLoader(true);
        let body = {
            "fees": Number(amount)
        }
        putMethod(`delivery/${getSelectedProduct._id}`, body, res => {
            if (res !== "error") {
                getCountryList();
                setBtnLoader(false);
                refRBSheet.current.close();
            } else {
                alert("Problem while updating delivery charge");
                setBtnLoader(false);
            }
        })
    }

    const renderIconButton = (icon, colour, item) => {
        return (
            <TouchableOpacity onPress={() => {
                    setSelectedProduct(item)
                    setAmount(String(item.fees))
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
                    <View style={{width: "80%"}}>
                        <Text type="heading" title={item.country} />
                        <Text type="heading" title={`Rs ${item.fees}`} style={{ color: COLOUR.PRIMARY, marginRight: 10 }} />
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
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLOUR.LIGHTBG }}>
                <Text type="heading" title={`Update delivery charge for ${getSelectedProduct.country}`} style={{ color: COLOUR.PRIMARY, fontWeight: "500" }} />
                <Input
                    value={amount}
                    onChangeText={data => setAmount(data)}
                    keyboardType={"number-pad"}
                    placeholder="Delivery fees" />
                <View style={{ flexDirection: "row", marginTop: 25 }}>
                    <Button onPress={() => updateFees()} title="Update" loader={btnLoader} style={{ width: "40%", margin: 5, backgroundColor: COLOUR.RED }} />
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
                onBackPress={() => props.navigation.goBack()}
            />
                <View style={styles.mainContainer}>
                        {loader ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator color={COLOUR.PRIMARY} size="large" /> 
                    </View> :
                    <View>
                        {/* <Input
                    value={country}
                    onChangeText={data => {
                        setCountry(data)
                    }}
                    keyboardType={"number-pad"}
                    placeholder="Search country" /> */}
                    <FlatList
                        data={countryList}
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
                        </View> }
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
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOUR.PRIMARY,
        marginHorizontal: 5
    }
})