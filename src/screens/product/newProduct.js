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
import { storeAnalytics, storeSellerProduct, postMethodFunction, storeCategory } from "../../../redux/actions";
import { RadioButton } from "react-native-paper";
import { imageSizeHandler } from "../../../utils/imageHandler";
import { CropView } from 'react-native-image-crop-tools';
import { awsuploadImageToBucket } from "../../../utils/awsconfig"
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../component/loader";
import { failure, net_failure } from "../../../constants/icons";
const { width, height } = Dimensions.get("screen");
let desc = "This Painting is 100% handmade made with original 22 carat gold leaves and authentic Jaipur gems by skilled artisans in Thanjavur. Beautiful gift for any auspicious occasion.\n\nMaterials: \n22 Carat Original Gold Foils, \nWater Resistant Plywood, Cloth, \npaints, \nauthentic Jaipur gem stones, \nArabic gum and chalk powder.\n\nFrame: \nTraditional Chettinad Teak Wood frame and Unbreakable fiberglass. Color: Multicolor.\n\nIdeal for:\n· Pooja rooms\n· Home Main Entrance\n· Pooja Doors\n· Waiting Halls\n· Office reception\n· Staircase wall\n· Study room\n· Sit-out area\n· Lobby Area"
export default function SignupFunction(props) {
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState([]);
    const [imageType, setImageType] = useState("");
    const [selectedMainCategory, setSelectedMainCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isPremium, setIsPremium] = useState("NON-PREMIUM");
    const [checked, setChecked] = useState(false);
    const [submitLoader, setSubmitLoader] = useState(false);
    const refRBSheet = useRef();
    const [cropImage, setCropImage] = useState("");
    const [s3Image, setS3Image] = useState([]);
    const [isImageSizeExceeds, setIsImageSizeExceeds] = useState("");
    const [renderCrop, setRenderCrop] = useState(false);
    const cropRef = useRef();
    const [imageProcessingType, setImageProcessingType] = useState("");
    const [imageUpdateId, setImageUpdateId] = useState(0);
    const [renderRBSheetType, setRenderRBSheetType] = useState("");
    const [sku, setSku] = useState("");
    const [specifications, setSpecifications] = useState("");
    const [mrp, setMrp] = useState(0);
    const [actualPrice, setActualPrice] = useState(0);
    const [pWidth, setPWidth] = useState(0);
    const [pHeight, setPHeight] = useState(0);
    const [whType, setWhType] = useState("CM");
    const [firstImageType, setFirstImageType] = useState("");
    const [showWeight, setShowWeight] = useState(false);
    const [productWeight, setProductWeight] = useState(0);
    const [productWeightType, setProductWeightType] = useState("KG");
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const [loading, setLoading] = useState(false);

    const categoryList = useSelector(state => state.categoryList);
    const mainCategoryList = useSelector(state => state.mainCategoryList);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.route.params?.catId) {
            let cat = props.route.params.catId;
            let filteredCatData = categoryList.find(x => x._id === cat);
            setSelectedCategory(filteredCatData)
        }

        performance()
    }, [])

    async function performance() {
        let details = [];
        let dummy = ["ONE", "TWO", "THREE"];
        let result = await dummy.map((item, index) => {
            return {id: index, item: item}
        })
        console.log(result);
    }

    async function submitProduct() {
        if (name === "" || description === "" || selectedCategory === "" || selectedMainCategory === "" || sku === "" || mrp === "" || mrp === 0 || actualPrice === "" || actualPrice === 0 || deliveryPrice === "") {
            ToastAndroid.show("Enter all the fields to continue....", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
        } else {
            if (await isInternetConnection()) {
                setSubmitLoader(true);
                let imageData = [];
                 await s3Image.map(async(item, index) => {
                    console.log("updated with index ",index, (s3Image.length - 1))
                    await awsuploadImageToBucket(item.data, "Products/").then(async response => {
                        imageData.push({
                            image: response.url,
                            imageCode: response.key
                        })
                        if(s3Image.length === imageData.length) {
                            updateProductToServer(imageData);
                        }
                    }).catch(error => {
                        console.log("error")
                        console.log(error)
                        return ToastAndroid.show("Something went wrong, while uploading images..", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                    })
                })
            } else {
                setNetErrorComponent(true);
            }
        }
    }

    const updateProductToServer = (image) => {
        let body = {
            "name": name,
            "description": description,
            "deliveryPrice": deliveryPrice,
            "category": selectedCategory._id,
            "image": image,
            "imageCode": "",
            "productOwner": global.uid,
            "imageType": firstImageType,
            "isPremium": actualPrice > 50000 ? true : false,
            "sku": sku,
            "specification": specifications,
            "price": actualPrice,
            "mrp": mrp,
            "width": pWidth,
            "height": pHeight,
            "whType": whType,
            "isPortrait": firstImageType === "PORTRAIT" ? true : false,
            "weight": productWeight,
            "weightType": productWeightType
        }
        console.log(body);
        return dispatch(postMethodFunction('product/newproduct', body)).then(res => {
            setName("");
            setImage([]);
            setS3Image([]);
            setSelectedCategory("");
            setIsPremium("NON-PREMIUM");
            setImageType("");
            setSku("");
            setSelectedMainCategory("");
            setDescription("");
            setSpecifications("");
            setMrp("");
            setActualPrice("");
            setPWidth(0);
            setPHeight(0);
            setWhType("CM");
            setProductWeightType("KG");
            setProductWeight("");
            setDeliveryPrice("");
            if (!checked) {
                props.navigation.goBack()
            }
            dispatch(storeSellerProduct(global.uid));
            setSubmitLoader(false);
            dispatch(storeAnalytics(global.uid))
            return ToastAndroid.show("Product added.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.LONG)
        }).catch(err => {
            setSubmitLoader(false)
            console.log("err")
            console.log(err)
            return ToastAndroid.show("Something went wrongs. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
        })
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
                console.log(response)
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
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });
    };

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
                                if (imageProcessingType === "NEW") {
                                    let s3imageList = s3Image;
                                    s3imageList.push({
                                        id: s3Image.length,
                                        data: fileData
                                    });
                                    setS3Image(s3imageList);
                                } else {
                                    let s3imageList = s3Image;
                                    let index = s3imageList.findIndex(x => x.id === imageUpdateId);
                                    s3imageList[index].data = fileData;
                                    setS3Image(s3imageList);
                                }
                                if ((stats.size / 1024 / 1024) > 3) {
                                    ToastAndroid.show("Image size is too big. Please upload another image.", ToastAndroid.CENTER, ToastAndroid.BOTTOM)
                                    return setRenderCrop(false);
                                } else {
                                    if (imageProcessingType === "NEW") {
                                        if(image.length === 0) {
                                            setFirstImageType(imageType);
                                        }
                                        let imageList = image;
                                        imageList.push({
                                            id: image.length,
                                            image: `file://${res.uri}`
                                        });
                                        setImage(imageList);
                                    } else {
                                        let imageList = image;
                                        let index = imageList.findIndex(x => x.id === imageUpdateId);
                                        imageList[index].image = `file://${res.uri}`;
                                        setImage(imageList);
                                    }
                                    return setRenderCrop(false);
                                }
                            })
                    }}
                    ref={cropRef}
                    keepAspectRatio = {false}
                    // aspectRatio={{ width: imageType === "SQUARE" ? 640 : imageType === "PORTRAIT" ? 640 : 1080, height: imageType === "SQUARE" ? 640 : imageType === "PORTRAIT" ? 820 : 640 }}
                /> : null}
                <Button title="Crop image" style={{ width: "60%" }} onPress={() => cropRef.current.saveImage(true, isImageSizeExceeds === "" ? 100 : isImageSizeExceeds)} />
            </View>
        )
    }
    if (renderCrop) {
        return renderCropPicker();
    }
    if (loading) {
        return <View style={styles.loaderContainer}><Loader /></View>
    }
    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Add Product"
                back
                onBackPress={() => props.navigation.goBack()} />
            <View style={styles.mainContainer}>
                <ScrollView style={{ width: "100%", paddingTop: 10 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.imageContainer}>
                        {
                            image.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={() => { setImageProcessingType("UPDATE"); setImageUpdateId(item.id); imageHandler() }} activeOpacity={9} style={[styles.imageButton, { borderWidth: 0 }]} >
                                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                        setLoading(true);
                                        let imgList1 = image;
                                        let imgList2 = s3Image;
                                        imgList1.splice(index, 1);
                                        imgList2.splice(index, 1);
                                        console.log(imgList1)
                                        setImage(imgList1)
                                        setS3Image(imgList2)
                                        setTimeout(() => {
                                            setLoading(false);
                                        }, 500)
                                    }} style={styles.removeImage}>
                                        <Icon name="close" size={10} color={COLOUR.WHITE} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            })
                        }
                        {
                            image.length < 4 ? <TouchableOpacity onPress={() => { setImageProcessingType("NEW"); setImageUpdateId(0); imageHandler() }} activeOpacity={9} style={styles.imageButton} >
                                <Icon name="plus" size={50} color={COLOUR.PRIMARY} />
                            </TouchableOpacity> : null
                        }
                    </View>
                    <View style={styles.inputContainer}>
                        {renderOptions("Portrait", "PORTRAIT")}
                        {renderOptions("Landscape", "LANDSCAPE")}
                        {renderOptions("Square", "SQUARE")}
                    </View>
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
                                style={{width: "48%"}}
                                placeholder="MRP" />
                                <Input
                                value={actualPrice}
                                style={{width: "48%"}}
                                onChangeText={data => setActualPrice(data)}
                                keyboardType={"number-pad"}
                                placeholder="Discount Price" />
                        </View> 
                        {showWeight ? <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                            <Input
                                value={pWidth}
                                onChangeText={data => setPWidth(data)}
                                keyboardType={"number-pad"}
                                style={{width: "48%"}}
                                placeholder="Width eg.(25)" />
                                <Input
                                value={pHeight}
                                style={{width: "48%"}}
                                onChangeText={data => setPHeight(data)}
                                keyboardType={"number-pad"}
                                placeholder="Height eg.(35)" />
                        </View> : null }

                        {showWeight ? <View style={{ width: "100%", height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            {renderPremiumButton("CENTIMETER", "CM")}
                            {renderPremiumButton("FEET", "FT")}
                        </View> : null }
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