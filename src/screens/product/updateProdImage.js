import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, ToastAndroid, Dimensions, Alert } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Button from "../../../component/button";
import { launchImageLibrary } from 'react-native-image-picker';
import { FlatList } from "react-native-gesture-handler";
import RNFetchBlob from 'rn-fetch-blob';
import Header from "../../../component/header";
import { uploadImg, storeSellerProduct, deleteImageFromAWS } from "../../../redux/actions";
import { putMethod } from "../../../utils/function";
const { width, height } = Dimensions.get("screen");
import { CropView } from 'react-native-image-crop-tools';
import { awsuploadImageToBucket } from "../../../utils/awsconfig"
import { ImageHandler } from "../../../component/imageHandler";
/* basic imports */
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../component/loader";

export default function UpdateProductImages(props) {
    const product_data = props.route.params.product;
    const [images, setImages] = useState([]);
    const [cropImage, setCropImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [renderCrop, setRenderCrop] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const cropRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        let product_data = props.route.params.product;
        setImages(product_data.image);
    }, []);
    function deleteImageHandler(item) {
        let image = images.filter(x => x.image !== item.image);
        setImages(image);
        let body = {
            "image": image
        }
        console.log("Image Code: ", item.imageCode);
        dispatch(deleteImageFromAWS(item.imageCode)).then(response => {
            console.log("deleteImageFromAWS response: ", response);
            console.log(`product/${product_data._id}`, body);
            return putMethod(`product/${product_data._id}`, body).then(res => {
                console.log(`product response`, res);
                dispatch(storeSellerProduct(global.uid));
                setIsUpdated(true);
                ToastAndroid.show("Images updated successfully.", ToastAndroid.CENTER, ToastAndroid.BOTTOM);
                return setLoading(false);
            }).catch(error => {
                console.log(error);
                return ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM);
            })
        })
    }
    function addImageFunction() {
        if (images.length < 4) {
            imageHandler();
        } else {
            return ToastAndroid.show("Image limit exceeds.", ToastAndroid.CENTER, ToastAndroid.BOTTOM);
        }
    }
    const imageHandler = () => {
        const mediaType = "photo";
        const photooptions = {
            title: "Attach Files",
            mediaType: mediaType,
            takePhotoButtonTitle: "Take a Photo",
            allowsEditing: true,
            quality: 1.0
        };
        let options = photooptions;
        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log(response.didCancel)
            } else if (response.error) {
                console.log(response.error)
            } else {
                RNFetchBlob.fs.stat(response.assets[0].uri)
                    .then(async (stats) => {
                        setCropImage(`${response.assets[0].uri}`);
                        setRenderCrop(true);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });
    };
    
    function renderCropPicker() {
        return (
            <View style={styles.cropViewContainer}>
                {cropImage !== "" ? <CropView
                    sourceUrl={cropImage ? cropImage : ""}
                    style={{ width: width, height: height / 1.5 }}
                    onImageCrop={(res) => {
                        return RNFetchBlob.fs.stat(`file://${res.uri}`)
                            .then(async (stats) => {
                                console.log("stats: ", stats)
                                let format = stats.filename.split(".");
                                let fileData = {
                                    uri: `file://${res.uri}`,
                                    name: stats.filename,
                                    type: `image/${format[1]}`
                                }
                                if ((stats.size / 1024 / 1024) > 5) {
                                    ToastAndroid.show("Image size is too big. Please upload another image.", ToastAndroid.CENTER, ToastAndroid.BOTTOM);
                                    return setRenderCrop(false);
                                } else {
                                    let image = images;
                                    setRenderCrop(false);
                                    setLoading(true);
                                    ToastAndroid.show("Image is being uploaded. Please wait.", ToastAndroid.CENTER, ToastAndroid.BOTTOM);
                                    awsuploadImageToBucket(fileData, "Products/").then(async response => {
                                        image.push({
                                            image: response.url,
                                            imageCode: response.key
                                        });
                                        setImages(image);
                                        let body = {
                                            "image": image
                                        }
                                        return putMethod(`product/${product_data._id}`, body).then(res => {
                                            dispatch(storeSellerProduct(global.uid));
                                            setIsUpdated(true);
                                            ToastAndroid.show("Image updated successfully.", ToastAndroid.CENTER, ToastAndroid.BOTTOM);
                                            return setLoading(false);
                                        }).catch(error => {
                                            ToastAndroid.show("Something went wrong. Please try again later.", ToastAndroid.CENTER, ToastAndroid.BOTTOM);
                                        })
                                    })
                                }
                            })
                    }}
                    ref={cropRef}
                /> : null}
                <View style={styles.cropButtonContainer}>
                <Button title="Upload Image" style={{ width: "45%" }} onPress={() => cropRef.current.saveImage(true, 100)} />
                <Button title="Cancel" style={{ width: "45%", backgroundColor: COLOUR.RED }} onPress={() => setRenderCrop(false)} />
                </View>
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
                title="Update Image"
                back
                rightIcon={"plus"}
                onRightButtonPress={() => addImageFunction()}
                onBackPress={() => {
                    if(isUpdated) {
                        global.selectedProductImage = images;
                    }
                    props.navigation.goBack()
                    }} />
            <View style={styles.mainContainer}>
                <FlatList
                    data={images}
                    numColumns={2}
                    renderItem={({ item, index }) => {
                        return <ImageHandler
                            onPress={() => 
                                Alert.alert("Warning!", "Are you sure want to delete this item?", [
                                    {
                                        text: "DELETE",
                                        onPress: () => deleteImageHandler(item)
                                    },
                                    {
                                        text: "CANCEL"
                                    }
                                ])
                                }
                            image={item.image} />
                    }}
                    keyExtractor={(item, index) => index} />
            </View>
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
        justifyContent: "center"
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
        alignItems: "center",
        justifyContent: "center"
    },
    cropButtonContainer: {
        width: "80%",
        height: 60,
        alignItems:"center",
        justifyContent: "space-around",
        flexDirection: "row"
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})