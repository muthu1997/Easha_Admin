import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, SafeAreaView, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { launchImageLibrary } from 'react-native-image-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import RNFetchBlob from 'rn-fetch-blob';
import { postMethod, uploadImage } from "../../../utils/function";
import moment from "moment";
import Header from "../../../component/header";
import { uploadImg, updateMethod, storeCategoryProduct, postMethodFunction } from "../../../redux/actions";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";

export default function SignupFunction(props) {
    const [description, setDescription] = useState("This Painting is 100% handmade made with original 22 carat gold leaves and authentic Jaipur gems by skilled artisans in Thanjavur. Beautiful gift for any auspicious occasion.\n\nMaterials: \n22 Carat Original Gold Foils, \nWater Resistant Plywood, Cloth, \npaints, \nauthentic Jaipur gem stones, \nArabic gum and chalk powder.\n\nFrame: \nTraditional Chettinad Teak Wood frame and Unbreakable fiberglass. Color: Multicolor.\n\nIdeal for:\n· Pooja rooms\n· Home Main Entrance\n· Pooja Doors\n· Waiting Halls\n· Office reception\n· Staircase wall\n· Study room\n· Sit-out area\n· Lobby Area");
    const [name, setName] = useState("");
    const [height, setHeight] = useState("");
    const [width, setWidth] = useState("");
    const [image, setImage] = React.useState("");
    const [sizeType, setSizeType] = React.useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [deliveryPrice, setDelivaryPrice] = useState("");
    const [checked, setChecked] = React.useState(false);
    const [submitLoader, setSubmitLoader] = React.useState(false);
    const refRBSheet = useRef();
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);

    const categoryList = useSelector(state => state.categoryList);
    const dispatch = useDispatch();

    useEffect(() => {
        if(props.route.params?.catId) {
            let cat = props.route.params.catId;
            let filteredCatData = categoryList.find(x => x._id === cat);
            setSelectedCategory(filteredCatData)
        }
    },[])

    async function submitProduct() {
        if (name === "" || description === "" || height === "" || width === "" || image === "" || sizeType === "" || selectedCategory === "") {
            ToastAndroid.show("Enter all the fields to continue....", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
        } else {
            setSubmitLoader(true)
            await uploadImg(image, name).then(async response => {
                console.log("comes here")
                let body = {
                    "name": name,
                    "description": description,
                    "width": Number(width),
                    "height": Number(height),
                    "type": sizeType,
                    "deliveryPrice": 0,
                    "category": selectedCategory._id,
                    "image": response,
                    "owner": "62ebe9823c05919f44021c4c",
                    "sizeId": "62ebe9823c05919f44021c4c"
                }
                return dispatch(postMethodFunction('product/newproduct', body)).then(res => {
                    setName("");
                    setImage("");
                    setWidth("");
                    setHeight("");
                    setSizeType("");
                    setDelivaryPrice("");
                    setSelectedCategory("");
                    if (!checked) {
                        props.navigation.goBack()
                    }
                    dispatch(storeCategoryProduct(props.route.params.catId))
                    setSubmitLoader(false)
                    return ToastAndroid.show("Product added.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG)
                }).catch(err => {
                    setSubmitLoader(false)
                    console.log("err")
                    console.log(err)
                    return ToastAndroid.show("Something went wrongs. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                })
            }).catch(error => {
                console.log("error")
                console.log(error)
                setSubmitLoader(false)
                return ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            })
        }
    }

    const imageHandler = () => {
        let mediaType = "photo";
        const photooptions = {
            title: "Attach Files",
            mediaType: mediaType,
            takePhotoButtonTitle: "Take a Photo",
            allowsEditing: true,
            quality: 0.3
        };
        let options = photooptions;
        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log(response.didCancel)
            } else if (response.error) {
                console.log(response.error)
            } else {
                console.log(response.assets[0].uri)
                RNFetchBlob.fs.stat(response.assets[0].uri)
                    .then(async (stats) => {
                        console.log("Size: ", (stats.size / 1024 / 1024))
                        if ((stats.size / 1024 / 1024) > 1) {
                            alert("Photo not allowed Greater than 1 MB");
                        } else {
                            setImage(`${response.assets[0].uri}`)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });
    };

    const renderOptionButton = (title) => {
        return (
            <Button
                style={{ width: "49%", marginVertical: 10, backgroundColor: sizeType === title ? COLOUR.PRIMARY : COLOUR.DARK_GRAY }}
                title={title}
                onPress={() => {
                    setSizeType(title)
                }}
            />
        )
    }

    const renderCategoryList = () => {
        return (
            <View style={styles.btmSheetContainer}>
                <FlatList
                    numColumns={3}
                    data={categoryList}
                    renderItem={({ item, index }) => {
                        return (
                            <Button
                                title={item.name}
                                onPress={() => {
                                    setSelectedCategory(item);
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

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Add Product"
                back
                onBackPress={() => props.navigation.goBack()} />
            <View style={styles.mainContainer}>
                <ScrollView style={{ width: "100%", paddingTop: 10 }} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => imageHandler()} activeOpacity={9} style={styles.imageButton} >
                        {!image ? <Icon name="plus" size={50} color={COLOUR.PRIMARY} /> : <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />}
                    </TouchableOpacity>
                    <View style={styles.formContainer}>
                        <Input
                            value={name}
                            onChangeText={data => setName(data)}
                            keyboardType={"default"}
                            placeholder="Product Name" />
                        <Input
                            value={description}
                            onChangeText={data => setDescription(data)}
                            keyboardType={"default"}
                            multiline
                            style={{ height: 150, textAlignVertical: 'top' }}
                            placeholder="Description" />
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            
                        </View>
                        <View style={{ width: "100%", height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            {renderOptionButton("CM")}
                            {renderOptionButton("INCH")}
                        </View>
                        <Button title={selectedCategory ? selectedCategory.name : "Select category"} onPress={() => refRBSheet.current.open()} style={[styles.categoryButton, { borderColor: selectedCategory ? COLOUR.PRIMARY : COLOUR.DARK_GRAY }]} textStyle={{ color: COLOUR.BLACK }} />
                        <View style={styles.termsContainer}>
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                color={COLOUR.PRIMARY}
                                onPress={() => {
                                    setChecked(!checked);
                                }}
                            />
                            <Text title="Continue adding product." type="paragraph" style={{ width: "90%" }} />
                        </View>
                        <Button title="Create" loader={submitLoader} onPress={() => {
                            if(!submitLoader) {
                                submitProduct()
                            }else {
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
                    {renderCategoryList()}
                </RBSheet>
                <Modal visible={showErrorComponent}>
                    <FailureComponent
                        errtitle="Oooops!"
                        errdescription="Unable to load the service. Connectivity issue is there. Please press try again button to load again."
                        positiveTitle="Try again"
                        onPressPositive={() => {
                            setLoading(true);
                            getDashboardAnalytics();
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
                            getDashboardAnalytics();
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
        width: "50%",
        height: 150,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLOUR.PRIMARY,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
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
    }
})