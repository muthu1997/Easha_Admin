import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, SafeAreaView, ToastAndroid, Dimensions } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { Checkbox } from 'react-native-paper';
import RBSheet from "react-native-raw-bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import Header from "../../../component/header";
import { storeSellerProduct, updateMethod, storeCategory, storeAnalytics } from "../../../redux/actions";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";
const { width, height } = Dimensions.get("screen");

export default function EditProduct(props) {
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [selectedMainCategory, setSelectedMainCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isPremium, setIsPremium] = useState("NON-PREMIUM");
    const [checked, setChecked] = useState(false);
    const [submitLoader, setSubmitLoader] = useState(false);
    const refRBSheet = useRef();
    const [renderRBSheetType, setRenderRBSheetType] = useState("");
    const [sku, setSku] = useState("");
    const [specifications, setSpecifications] = useState("");
    const [mrp, setMrp] = useState(0);
    const [actualPrice, setActualPrice] = useState(0);
    const [pWidth, setPWidth] = useState(0);
    const [pHeight, setPHeight] = useState(0);
    const [whType, setWhType] = useState("CM");
    const [showWeight, setShowWeight] = useState(false);
    const [productWeight, setProductWeight] = useState(0);
    const [productWeightType, setProductWeightType] = useState("KG");
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);

    const categoryList = useSelector(state => state.categoryList);
    const mainCategoryList = useSelector(state => state.mainCategoryList);
    const dispatch = useDispatch();
    const product_data = props.route.params.data;

    useEffect(() => {
        let data = props.route.params.data;

        console.log("Main Category List: ", data.category, mainCategoryList)
        const mainCat = mainCategoryList.find(x => x._id === data.category.parentCategory);
        const cat = data.category;
        setName(data.name);
        setSku(String(data.sku));
        setDescription(data.description);
        setSpecifications(data.specification);
        setMrp(String(data.mrp));
        setActualPrice(String(data.price));
        setPWidth(String(data.width));
        setPHeight(String(data.height));
        setWhType(String(data.whType));
        setProductWeightType(String(data.weightType));
        setProductWeight(String(data.weight));
        setDeliveryPrice(String(data.deliveryPrice));
        console.log("Category: ", data.category)
        setSelectedCategory(cat);
        console.log("Main Category: ", mainCat)
        setSelectedMainCategory(mainCat);
        setTimeout(() => setLoading(false), 500);
    }, [])

    async function submitProduct() {
        if (name === "" || description === "" || selectedCategory === "" || selectedMainCategory === "" || sku === "" || mrp === "" || mrp === 0 || actualPrice === "" || actualPrice === 0 || deliveryPrice === "") {
            ToastAndroid.show("Enter all the fields to continue....", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
        } else {
            if (await isInternetConnection()) {
                setSubmitLoader(true);
                updateProductToServer()
            } else {
                setNetErrorComponent(true);
            }
        }
    }

    const updateProductToServer = () => {
        let proData = props.route.params.data;
        let body = {
            "name": name,
            "description": description,
            "deliveryPrice": deliveryPrice,
            "category": selectedCategory._id,
            "productOwner": global.uid,
            "isPremium": actualPrice > 50000 ? true : false,
            "sku": sku,
            "specification": specifications,
            "price": actualPrice,
            "mrp": mrp,
            "width": pWidth,
            "height": pHeight,
            "whType": whType,
            "weight": productWeight,
            "weightType": productWeightType
        }
        return dispatch(updateMethod(`product/${proData._id}`, body)).then(res => {
            dispatch(storeSellerProduct(global.uid));
            setSubmitLoader(false)
            dispatch(storeAnalytics(global.uid))
            props.navigation.goBack();
            return ToastAndroid.show("Product updated.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG)
        }).catch(err => {
            setSubmitLoader(false)
            console.log("err")
            console.log(err)
            return ToastAndroid.show("Something went wrongs. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
        })
    }

    const renderPremiumButton = (title, type) => {
        return (
            <Button
                style={{ width: "49%", marginVertical: 10, backgroundColor: whType === type ? COLOUR.GOLD : COLOUR.GRAY }}
                title={title}
                onPress={() => {
                    setWhType(type)
                }}
            />
        )
    }

    const renderPremiumButton1 = (title, type) => {
        return (
            <Button
                style={{ width: "49%", marginVertical: 10, backgroundColor: productWeightType === type ? COLOUR.GOLD : COLOUR.GRAY }}
                title={title}
                onPress={() => {
                    setProductWeightType(type)
                }}
            />
        )
    }

    const renderCategoryList = () => {
        return (
            <View style={styles.btmSheetContainer}>
                <FlatList
                    numColumns={3}
                    data={categoryList.filter(x => x.parentCategory === selectedMainCategory._id)}
                    renderItem={({ item, index }) => {
                        return (
                            <Button
                                title={item.name}
                                onPress={() => {
                                    setSelectedCategory(item);
                                    setShowWeight(item.showDimensions);
                                    refRBSheet.current.close()
                                }}
                                style={{ paddingHorizontal: 10, margin: 5, paddingVertical: 5, borderRadius: 5, borderWidth: 2, borderColor: COLOUR.PRIMARY, width: "30%" }} />
                        )
                    }}
                    keyExtractor={item => item._id}
                />
            </View>
        )
    }

    const renderMainCategoryList = () => {
        return (
            <View style={styles.btmSheetContainer}>
                <FlatList
                    numColumns={3}
                    data={mainCategoryList}
                    renderItem={({ item, index }) => {
                        return (
                            <Button
                                title={item.name}
                                onPress={() => {
                                    setSelectedMainCategory(item);
                                    dispatch(storeCategory(item._id));
                                    setSelectedCategory("");
                                    refRBSheet.current.close()
                                }}
                                style={{ paddingHorizontal: 10, margin: 5, paddingVertical: 5, borderRadius: 5, borderWidth: 2, borderColor: COLOUR.PRIMARY, width: "30%" }} />
                        )
                    }}
                    keyExtractor={item => item._id}
                />
            </View>
        )
    }

    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Update Product"
                back
                onBackPress={() => props.navigation.goBack()} />
            <View style={styles.mainContainer}>
                <ScrollView style={{ width: "100%", paddingTop: 10 }} showsVerticalScrollIndicator={false}>
                    <Button
                        title="Update Product Images >>"
                        onPress={() => {
                            if(global.selectedProductImage !== undefined) {
                                product_data.image = global.selectedProductImage;
                                setTimeout(() => {
                                    global.selectedProductImage = undefined;
                                },500);
                            }
                            props.navigation.navigate("UpdateProductImage", { product: product_data })
                        }}
                        style={[styles.buttonStyle, { marginBottom: 20 }]}
                        textStyle={{ color: COLOUR.WHITE }} />
                    <View style={styles.formContainer}>
                        <Input
                            value={name}
                            onChangeText={data => setName(data)}
                            keyboardType={"default"}
                            placeholder="Product Name" />
                        <Input
                            value={sku}
                            onChangeText={data => setSku(data)}
                            keyboardType={"default"}
                            placeholder="SKU" />
                        <Button title={selectedMainCategory ? selectedMainCategory.name : "Select main category"} onPress={() => { setRenderRBSheetType("MAIN"); refRBSheet.current.open() }} style={[styles.categoryButton, { borderColor: selectedCategory ? COLOUR.PRIMARY : COLOUR.DARK_GRAY }]} textStyle={{ color: COLOUR.BLACK }} />
                        {selectedMainCategory ? <Button title={selectedCategory ? selectedCategory.name : "Select sub category"} onPress={() => { setRenderRBSheetType("SUB"); refRBSheet.current.open() }} style={[styles.categoryButton, { borderColor: selectedCategory ? COLOUR.PRIMARY : COLOUR.DARK_GRAY }]} textStyle={{ color: COLOUR.BLACK }} /> : null}
                        <Input
                            value={description}
                            onChangeText={data => setDescription(data)}
                            keyboardType={"default"}
                            multiline
                            style={{ height: 150, textAlignVertical: 'top' }}
                            placeholder="Description" />
                        <Input
                            value={specifications}
                            onChangeText={data => setSpecifications(data)}
                            keyboardType={"default"}
                            multiline
                            style={{ height: 100, textAlignVertical: 'top' }}
                            placeholder="Specifications(optional)" />
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Input
                                value={mrp}
                                onChangeText={data => setMrp(data)}
                                keyboardType={"number-pad"}
                                style={{ width: "48%" }}
                                placeholder="MRP" />
                            <Input
                                value={actualPrice}
                                style={{ width: "48%" }}
                                onChangeText={data => setActualPrice(data)}
                                keyboardType={"number-pad"}
                                placeholder="Discount Price" />
                        </View>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Input
                                value={pWidth}
                                onChangeText={data => setPWidth(data)}
                                keyboardType={"number-pad"}
                                style={{ width: "48%" }}
                                placeholder="Width eg.(25)" />
                            <Input
                                value={pHeight}
                                style={{ width: "48%" }}
                                onChangeText={data => setPHeight(data)}
                                keyboardType={"number-pad"}
                                placeholder="Height eg.(35)" />
                        </View>

                        <View style={{ width: "100%", height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            {renderPremiumButton("CENTIMETER", "CM")}
                            {renderPremiumButton("FEET", "FT")}
                        </View>
                        <Input
                            value={productWeight}
                            onChangeText={data => setProductWeight(data)}
                            keyboardType={"number-pad"}
                            placeholder="Product Weight eg.(10KG)" />
                        <View style={{ width: "100%", height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            {renderPremiumButton1("KILOGRAM", "KG")}
                            {renderPremiumButton1("GRAM", "GM")}
                        </View>
                        <Input
                            value={deliveryPrice}
                            onChangeText={data => setDeliveryPrice(data)}
                            keyboardType={"number-pad"}
                            placeholder="Delivery Price eg.(100)" />
                        <Button title="Update" loader={submitLoader} onPress={() => {
                            if (!submitLoader) {
                                submitProduct()
                            } else {
                                ToastAndroid.show("Please wait. Product data is uploading to server.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                            }
                        }} style={[styles.buttonStyle, { marginBottom: 20 }]} textStyle={{ color: COLOUR.WHITE }} />
                    </View>
                </ScrollView>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    customStyles={{
                        wrapper: {
                            backgroundColor: COLOUR.SECONDARY_LIGHT
                        },
                        draggableIcon: {
                            backgroundColor: "#000"
                        },
                        container: {
                            height: "50%"
                        }
                    }}
                >
                    {renderRBSheetType === "SUB" ? renderCategoryList() : renderMainCategoryList()}
                </RBSheet>
                <Modal visible={showErrorComponent}>
                    <FailureComponent
                        errtitle="Oooops!"
                        errdescription="Unable to load the service. Connectivity issue is there. Please press try again button to load again."
                        positiveTitle="Try again"
                        onPressPositive={() => {
                            setLoading(true);
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
                            setNetErrorComponent(false);
                        }}
                        icon={net_failure} />
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    mainIcon: {
        width: 80,
        height: 80
    },
    buttonStyle: {
        marginTop: 10,
        width: "100%"
    },
    categoryButton: {
        marginTop: 10,
        width: "100%",
        backgroundColor: COLOUR.WHITE,
        borderWidth: 2,
        borderColor: COLOUR.GRAY,
        marginBottom: 10
    },
    headingContainer: {
        width: "100%",
        alignItems: 'center',
        marginBottom: 25
    },
    formContainer: {
        width: '100%',
        marginTop: 25,
        alignItems: 'center'
    },
    termsContainer: {
        width: "100%",
        height: 40,
        marginTop: 15,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-start"
    },
    imageButton: {
        width: width / 6,
        height: width / 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLOUR.PRIMARY,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        margin: 5
    },
    btmSheetContainer: {
        flex: 1,
        alignItems: "center"
    },
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "10%"
    },
    optionContainer: {
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "center"
    },
    cropViewContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOUR.BLACK
    },
    imageContainer: {
        width: "100%",
        height: 150,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    removeImage: {
        width: 20,
        height: 20,
        backgroundColor: COLOUR.RED,
        position: "absolute",
        top: 0,
        right: 0,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})