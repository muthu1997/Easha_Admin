import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, SafeAreaView, ToastAndroid, Dimensions } from "react-native";
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
import Header from "../../../component/header";
import { uploadImg, storeCategoryProduct, deleteImageFromAWS } from "../../../redux/actions";
import { RadioButton } from "react-native-paper";
import { putMethod } from "../../../utils/function";
const { width, height } = Dimensions.get("screen");
import { CropView } from 'react-native-image-crop-tools';
import { imageSizeHandler } from "../../../utils/imageHandler";
import { awsuploadImageToBucket } from "../../../utils/awsconfig"
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";

export default function UpdateProducts(props) {
    const [description, setDescription] = useState("This Painting is 100% handmade made with original 22 carat gold leaves and authentic Jaipur gems by skilled artisans in Thanjavur. Beautiful gift for any auspicious occasion.\n\nMaterials: \n22 Carat Original Gold Foils, \nWater Resistant Plywood, Cloth, \npaints, \nauthentic Jaipur gem stones, \nArabic gum and chalk powder.\n\nFrame: \nTraditional Chettinad Teak Wood frame and Unbreakable fiberglass. Color: Multicolor.\n\nIdeal for:\n· Pooja rooms\n· Home Main Entrance\n· Pooja Doors\n· Waiting Halls\n· Office reception\n· Staircase wall\n· Study room\n· Sit-out area\n· Lobby Area");
    const [name, setName] = useState("");
    const [imageStatus, setImageStatus] = React.useState(false);
    const [image, setImage] = React.useState("");
    const [imageType, setImageType] = React.useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isPremium, setIsPremium] = useState("NON-PREMIUM");
    const [submitLoader, setSubmitLoader] = React.useState(false);
    const refRBSheet = useRef();
    const [cropImage, setCropImage] = useState("");
    const [s3Image, setS3Image] = useState("");
    const [isImageSizeExceeds, setIsImageSizeExceeds] = useState("");
    const [renderCrop, setRenderCrop] = useState(false);
    const cropRef = useRef();
    // edit crop picker height and width management
    const [squareWidth, setSquareWidth] = useState(640);
    const [portraitWidth, setPortraitWidth] = useState(710);
    const [landscapeWidth, setLandscapeWidth] = useState(1080);
    const [squareHeight, setSquareHeight] = useState(640);
    const [portraitHeight, setPortraitHeight] = useState(840);
    const [landscapeHeight, setLandscapeHeight] = useState(720);
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(true);

    const categoryList = useSelector(state => state.categoryList);
    const dispatch = useDispatch();

    useEffect(() => {
        let data = props.route.params.data;
        setName(data.name);
        setDescription(data.description);
        setImage(data.image);
        setSelectedCategory(data.category)
        setImageType(data.imageType)
        setIsPremium(data.isPremium ? "PREMIUM" : "NON-PREMIUM")
    }, [])

    async function submitProduct() {
        if (name === "" || description === "" || image === "" || imageType === "" || selectedCategory === "") {
            ToastAndroid.show("Enter all the fields to continue....", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
        } else {
            if (imageStatus === true) {
                submitWithImage();
            } else {
                submitWithoutImage();
            }
        }
    }

    async function submitWithImage() {
        let proData = props.route.params.data;
        if (await isInternetConnection()) {
            awsuploadImageToBucket(s3Image, "Products/").then(async response => {
                setSubmitLoader(true)
                let body = {
                    "name": name,
                    "description": description,
                    "category": selectedCategory._id,
                    "image": response.url,
                    "imageCode": response.key,
                    "imageType": imageType,
                    "isPremium": isPremium === "PREMIUM" ? true : false
                }
                return putMethod(`product/${proData._id}`, body).then(res => {
                    dispatch(deleteImageFromAWS(proData.imageCode))
                    dispatch(storeCategoryProduct(proData.category._id))
                    props.navigation.goBack()
                    setSubmitLoader(false)
                    return ToastAndroid.show("Product updated!", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG)
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
        } else {
            setNetErrorComponent(true);
        }
    }

    async function submitWithoutImage() {
        let proData = props.route.params.data;
        if (await isInternetConnection()) {
            setSubmitLoader(true)
            let body = {
                "name": name,
                "description": description,
                "category": selectedCategory._id,
                "owner": "62ebe9823c05919f44021c4c",
                "imageType": imageType,
                "isPremium": isPremium === "PREMIUM" ? true : false
            }
            return putMethod(`product/${proData._id}`, body).then(res => {
                dispatch(storeCategoryProduct(proData.category._id))
                props.navigation.goBack()
                setSubmitLoader(false)
                return ToastAndroid.show("Product updated.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG)
            }).catch(err => {
                setSubmitLoader(false)
                console.log("err")
                console.log(err)
                return ToastAndroid.show("Something went wrongs. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            })
        } else {
            setNetErrorComponent(true);
        }
    }

    const imageHandler = () => {
        if (imageType === "") {
            return ToastAndroid.show("Please select image orientation(eg. Portrait)", ToastAndroid.BOTTOM, ToastAndroid.CENTER);
        }
        let mediaType = "photo";
        const photooptions = {
            title: "Attach Files",
            mediaType: mediaType,
            takePhotoButtonTitle: "Take a Photo",
            allowsEditing: true,
            quality: 1.0
        };
        let options = photooptions;
        launchImageLibrary(options, async (response) => {
            setIsImageSizeExceeds("");
            if (response.didCancel) {
                console.log(response.didCancel)
            } else if (response.error) {
                console.log(response.error)
            } else {
                console.log(response.assets[0].uri)
                RNFetchBlob.fs.stat(response.assets[0].uri)
                    .then(async (stats) => {
                        console.log(response)
                        console.log("original fileSize", response.assets[0].fileSize)
                        if ((stats.size / 1024 / 1024) > 2) {
                            console.log("if statement")
                            setCropImage(`${response.assets[0].uri}`)
                            imageSizeHandler(response.assets[0].fileSize).then(response => {
                                console.log("Compress percentage: ", response)
                                setIsImageSizeExceeds(response);
                                setRenderCrop(true)
                            }).catch(error => {
                                console.log(error)
                                ToastAndroid.show("Something went wrong, please try with different image.", ToastAndroid.BOTTOM, ToastAndroid.CENTER)
                            })
                        } else {
                            console.log("else statement")
                            setCropImage(`${response.assets[0].uri}`)
                            setRenderCrop(true)
                            // RNFetchBlob.fs.readFile(response.assets[0].uri, 'base64').then(res => 
                            //     setImage(`data:${response.assets[0].type};base64,${res}`)
                            //     )
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });
    };

    const renderPremiumButton = (title) => {
        return (
            <Button
                style={{ width: "49%", marginVertical: 10, backgroundColor: isPremium === title ? COLOUR.GOLD : COLOUR.GRAY }}
                title={title}
                onPress={() => {
                    setIsPremium(title)
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

    function renderOptions(title, value) {
        return (
            <View style={styles.optionContainer}>
                <RadioButton color={COLOUR.PRIMARY} status={imageType === value ? "checked" : "unchecked"} onPress={() => setImageType(value)} />
                <Text title={title} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
            </View>
        )
    }

    function renderCropPicker() {
        return (
            <View style={styles.cropViewContainer}>
                {cropImage !== "" ? <CropView
                    sourceUrl={cropImage ? cropImage : ""}
                    style={{ width: width, height: height / 1.5 }}
                    onImageCrop={(res) => {
                        console.log(res.uri)
                        console.log("final size ", res)
                        return RNFetchBlob.fs.stat(`file://${res.uri}`)
                            .then(async (stats) => {
                                console.log("stats: ", stats)
                                console.log("total size: ", (stats.size / 1024 / 1024))
                                let format = stats.filename.split(".");
                                let fileData = {
                                    uri: `file://${res.uri}`,
                                    name: stats.filename,
                                    type: `image/${format[1]}`
                                }
                                setS3Image(fileData);
                                setImageStatus(true)
                                if ((stats.size / 1024 / 1024) > 3) {
                                    ToastAndroid.show("Image size is too big. Please upload another image.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
                                    return setRenderCrop(false);
                                } else {
                                    setImage(`file://${res.uri}`);
                                    return setRenderCrop(false);
                                }
                            })
                    }}
                    ref={cropRef}
                    keepAspectRatio
                    aspectRatio={{ width: imageType === "SQUARE" ? squareWidth : imageType === "PORTRAIT" ? portraitWidth : landscapeWidth, height: imageType === "SQUARE" ? squareHeight : imageType === "PORTRAIT" ? portraitHeight : landscapeHeight }}
                /> : null}
                <View style={styles.editContainer}>
                    <View style={{ flexDirection: "row", marginRight: 5, alignItems:"center" }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => imageType === "SQUARE" ? setSquareWidth(squareWidth - 30) : imageType === "PORTRAIT" ? setPortraitWidth(portraitWidth - 30) : setLandscapeWidth(landscapeWidth - 30)} style={styles.editButton}>
                        <Icon name="minus" size={20} />
                        </TouchableOpacity>
                        <Text title={"Width"} type="hint" style={{ color: COLOUR.WHITE }} />
                        <TouchableOpacity activeOpacity={0.8} onPress={() => imageType === "SQUARE" ? setSquareWidth(squareWidth + 30) : imageType === "PORTRAIT" ? setPortraitWidth(portraitWidth + 30) : setLandscapeWidth(landscapeWidth + 30)} style={styles.editButton}>
                        <Icon name="plus" size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", marginLeft: 5, alignItems:"center" }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => imageType === "SQUARE" ? setSquareHeight(squareHeight - 30) : imageType === "PORTRAIT" ? setPortraitHeight(portraitHeight - 30) : setLandscapeHeight(landscapeHeight - 30)} style={styles.editButton}>
                        <Icon name="minus" size={20} />
                        </TouchableOpacity>
                        <Text title={"Height"} type="hint" style={{ color: COLOUR.WHITE }} />
                        <TouchableOpacity activeOpacity={0.8} onPress={() => imageType === "SQUARE" ? setSquareHeight(squareHeight + 30) : imageType === "PORTRAIT" ? setPortraitHeight(portraitHeight + 30) : setLandscapeHeight(landscapeHeight + 30)} style={styles.editButton}>
                        <Icon name="plus" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Button title="Crop image" style={{ width: "60%" }} onPress={() => cropRef.current.saveImage(true, isImageSizeExceeds === "" ? 100 : isImageSizeExceeds)} />
            </View>
        )
    }
    if (renderCrop) {
        return renderCropPicker();
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
                        <Button title={selectedCategory ? selectedCategory.name : "Select category"} onPress={() => refRBSheet.current.open()} style={[styles.categoryButton, { borderColor: selectedCategory ? COLOUR.PRIMARY : COLOUR.DARK_GRAY }]} textStyle={{ color: COLOUR.BLACK }} />
                        <View style={styles.inputContainer}>
                            {renderOptions("Portrait", "PORTRAIT")}
                            {renderOptions("Landscape", "LANDSCAPE")}
                            {renderOptions("Square", "SQUARE")}
                        </View>
                        <View style={{ width: "100%", height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            {renderPremiumButton("PREMIUM")}
                            {renderPremiumButton("NON-PREMIUM")}
                        </View>
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
                    {renderCategoryList()}
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
    editContainer: {
        width: "50%",
        padding: 5,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
        marginBottom: 5
    },
    editButton: {
        backgroundColor: COLOUR.WHITE,
        width: 25,
        height: 25,
        alignItems:"center",
        justifyContent: "center"
    }
})