import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image, ToastAndroid, Modal, FlatList, Dimensions } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from "react-native-raw-bottom-sheet";
import { updateMethod, storeCategory, postMethodFunction, deleteImageFromAWS } from "../../../redux/actions";
import { CropView } from 'react-native-image-crop-tools';
import { imageSizeHandler } from "../../../utils/imageHandler";
import { awsuploadImageToBucket } from "../../../utils/awsconfig"
import { RadioButton } from "react-native-paper";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch, useSelector } from "react-redux";
import { failure, net_failure } from "../../../constants/icons";
import Header from "../../../component/header";
const { width, height } = Dimensions.get("screen");

export default function EditCategoryScreen(props) {
    const [name, setName] = useState("");
    const [pCategoryId, setPCategoryId] = useState("");
    const [loader, setLoader] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [isImageSizeExceeds, setIsImageSizeExceeds] = React.useState("");
    const [image, setImage] = React.useState("");
    const [imageUpdated, setImageUpdated] = React.useState(false);
    const [cropImage, setCropImage] = React.useState("");
    const [s3Image, setS3Image] = useState("");
    const [id, setId] = React.useState("");
    const [renderCrop, setRenderCrop] = React.useState(false);
    const [showDimensions, setShowDimensions] = useState("NOTSHOW");
    const [showSizeSelection, setShowSizeSelection] = useState("NOTSHOW");
    const cropRef = useRef();
    const refRBSheet = useRef();
    const mainCategoryList = useSelector(state => state.mainCategoryList)
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const dispatch = useDispatch();
    const data = props.route.params.data

    useEffect(() => {
        if (props.route.params.type === "edit") {
            setName(data.name);
            setImage(data.image);
            setId(data._id);
            setPCategoryId(mainCategoryList.filter(x => x._id === data.parentCategory)[0]);
            setShowDimensions(data.showDimensions === true ? "SHOW" : "NOTSHOW");
            setShowSizeSelection(data.showSizeSelection === true ? "SHOW" : "NOTSHOW");
            console.log(data)
        } else {
            setName("");
            setImage("");
        }
    }, [])

    const imageHandler = () => {
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
            console.log(response)
            if (response.didCancel) {
                console.log(response.didCancel)
            } else if (response.error) {
                console.log(response.error)
            } else {
                console.log(response)
                RNFetchBlob.fs.stat(response.assets[0].uri)
                    .then(async (stats) => {
                        console.log(response)
                        if ((stats.size / 1024 / 1024) > 2) {
                            console.log("original fileSize", response.assets[0].fileSize)
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

    async function submitCategory() {
        if (await isInternetConnection()) {
            if (image === "") {
                ToastAndroid.show("Image required...", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            } else if (name === "") {
                ToastAndroid.show("Name required...", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            } else if (pCategoryId === "") {
                ToastAndroid.show("Select main category...", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            } else {
                setLoader(true);
                awsuploadImageToBucket(s3Image, "Categories/").then(async response => {
                    let body = {
                        "name": name,
                        "image": response.url,
                        "imageCode": response.key,
                        "parentCategory": pCategoryId._id,
                        "showDimensions": showDimensions === "SHOW" ? true : false,
                        "showSizeSelection": showSizeSelection === "SHOW" ? true : false
                    }
                    dispatch(postMethodFunction('category/newcategory', body)).then(res => {
                        dispatch(storeCategory(pCategoryId._id))
                        setName("");
                        setImage("");
                        if (!checked) {
                            props.navigation.goBack()
                        }
                        setLoader(false)
                    }).catch(err => {
                        setLoader(false)
                        ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                    })
                }).catch(error => {
                    setLoader(false)
                    ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                })
            }
        } else {
            setNetErrorComponent(true);
        }
    }

    async function updateCategory() {
        if (await isInternetConnection()) {
            if (image === "") {
                ToastAndroid.show("Image required...", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            } else if (name === "") {
                ToastAndroid.show("Name required...", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            } else if (pCategoryId === "") {
                ToastAndroid.show("Select main category...", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            } else {
                setLoader(true);
                if (imageUpdated) {
                    awsuploadImageToBucket(s3Image, "Categories/").then(async response => {
                        let body = {
                            "name": name,
                            "image": response.url,
                            "imageCode": response.key,
                            "parentCategory": pCategoryId._id,
                            "showDimensions": showDimensions === "SHOW" ? true : false,
                            "showSizeSelection": showSizeSelection === "SHOW" ? true : false
                        }
                        dispatch(updateMethod(`category/${id}`, body)).then(res => {
                            dispatch(deleteImageFromAWS(data.imageCode))
                            dispatch(storeCategory(pCategoryId._id))
                            setName("");
                            setImage("");
                            props.navigation.goBack()
                            setLoader(false)
                        }).catch(err => {
                            setLoader(false)
                            ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                        })
                    }).catch(error => {
                        setLoader(false)
                        ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                    })
                } else {
                    let body = {
                        "name": name,
                        "parentCategory": pCategoryId._id,
                        "showDimensions": showDimensions === "SHOW" ? true : false,
                        "showSizeSelection": showSizeSelection === "SHOW" ? true : false
                    }
                    dispatch(updateMethod(`category/${id}`, body)).then(res => {
                        dispatch(storeCategory(pCategoryId._id))
                        setName("");
                        setImage("");
                        props.navigation.goBack()
                        setLoader(false)
                    }).catch(err => {
                        setLoader(false)
                        ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                    })
                }
            }
        } else {
            setNetErrorComponent(true);
        }
    }

    function renderCropPicker() {
        return (
            <View style={styles.cropViewContainer}>
                <CropView
                    sourceUrl={cropImage}
                    style={{ width: width, height: height / 1.5 }}
                    onImageCrop={(res) => {
                        console.log(res.uri)
                        console.log("final size ", res)
                        RNFetchBlob.fs.stat(`file://${res.uri}`)
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
                                if (props.route.params.type === "edit") {
                                    setImageUpdated(true);
                                }
                                console.log(fileData)
                                if ((stats.size / 1024 / 1024) > 2) {
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
                    aspectRatio={{ width: 640, height: 640 }}
                />
                <Button title="Crop image" style={{ width: "60%" }} onPress={() => cropRef.current.saveImage(true, isImageSizeExceeds === "" ? 100 : isImageSizeExceeds)} />
            </View>
        )
    }
    const renderCategoryList = () => {
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
                                    setPCategoryId(item);
                                    refRBSheet.current.close()
                                }}
                                style={{ paddingHorizontal: 10, margin: 5, paddingVertical: 5, borderRadius: 5, borderWidth: 2, borderColor: COLOUR.PRIMARY, width: "33%" }} />
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
                <RadioButton color={COLOUR.PRIMARY} status={showDimensions === value ? "checked" : "unchecked"} onPress={() => setShowDimensions(value)} />
                <Text title={title} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
            </View>
        )
    }
    function renderOptions1(title, value) {
        return (
            <View style={styles.optionContainer}>
                <RadioButton color={COLOUR.PRIMARY} status={showSizeSelection === value ? "checked" : "unchecked"} onPress={() => setShowSizeSelection(value)} />
                <Text title={title} type="hint" style={{ color: COLOUR.DARK_GRAY }} />
            </View>
        )
    }

    if (renderCrop) {
        return renderCropPicker();
    }
    return (
        <SafeAreaView style={styles.container}>
            <Header
                back
                onBackPress={() => props.navigation.goBack()}
                title={props.route.params.type === "edit" ? "Edit Category" : "New Category"}
            />
            <View style={styles.mainContainer}>
                <TouchableOpacity onPress={() => imageHandler()} activeOpacity={9} style={[styles.imageButton, { borderWidth: !image ? 2 : 0 }]} >
                    {!image ? <Icon name="plus" size={50} color={COLOUR.PRIMARY} /> : <Image source={{ uri: image }} resizeMode="contain" style={{ width: "100%", height: "100%" }} />}
                </TouchableOpacity>
                <View style={styles.formContainer}>
                    <Input
                        value={name}
                        onChangeText={data => setName(data)}
                        keyboardType={"default"}
                        placeholder="Category Name" />
                    <Button
                        title={pCategoryId ? pCategoryId.name : "Select Main category"}
                        onPress={() => refRBSheet.current.open()}
                        style={[styles.categoryButton, { borderColor: pCategoryId ? COLOUR.PRIMARY : COLOUR.DARK_GRAY }]}
                        textStyle={{ color: COLOUR.BLACK }} />
                    <View style={styles.inputContainer}>
                        {renderOptions("Show Dimensions", "SHOW")}
                        {renderOptions("Don't Show", "NOTSHOW")}
                    </View>
                    <View style={styles.inputContainer}>
                        {renderOptions1("Show Size Selection", "SHOW")}
                        {renderOptions1("Don't Show", "NOTSHOW")}
                    </View>
                    <View style={styles.termsContainer}>
                        <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            color={COLOUR.PRIMARY}
                            onPress={() => {
                                setChecked(!checked);
                            }}
                        />
                        <Text title="Continue adding category." type="paragraph" style={{ width: "90%" }} />
                    </View>
                    <Button title={props.route.params.type === "edit" ? "Update" : "Create"} loader={loader} onPress={() => {
                        if (props.route.params.type === "edit") {
                            updateCategory()
                        } else {
                            submitCategory()
                        }
                    }} style={[styles.buttonStyle]} textStyle={{ color: COLOUR.WHITE }} />
                </View>
            </View>
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
                        getCategoryList();
                        setNetErrorComponent(false);
                    }}
                    icon={net_failure} />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "10%"
    },
    mainIcon: {
        width: 80,
        height: 80
    },
    buttonStyle: {
        marginTop: 10,
        width: "100%"
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
        borderColor: COLOUR.PRIMARY,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center"
    },
    cropViewContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOUR.BLACK
    },
    btmSheetContainer: {
        flex: 1,
        alignItems: "center"
    },
    categoryButton: {
        marginTop: 10,
        width: "100%",
        backgroundColor: COLOUR.WHITE,
        borderWidth: 2,
        borderColor: COLOUR.GRAY,
        marginBottom: 10
    },
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        alignSelf: "center"
    },
    optionContainer: {
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
})