import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image, ToastAndroid, Modal } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { uploadImg, updateMethod, storeCategory, postMethodFunction } from "../../../redux/actions";
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch } from "react-redux";
import { failure, net_failure } from "../../../constants/icons";
import Header from "../../../component/header";

export default function SignupFunction(props) {
    const [name, setName] = useState("");
    const [loader, setLoader] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [image, setImage] = React.useState("");
    const [id, setId] = React.useState("");
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.route.params.type === "edit") {
            let data = props.route.params.data
            setName(data.name);
            setImage(data.image);
            setId(data._id);
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
            } else {
                setLoader(true);
                await uploadImg(image, name).then(async response => {
                    let body = {
                        "name": name,
                        "image": response
                    }
                    dispatch(postMethodFunction('category/newcategory', body)).then(res => {
                        dispatch(storeCategory())
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
            } else {
                setLoader(true);
                await uploadImg(image, name).then(async response => {
                    let body = {
                        "name": name,
                        "image": response
                    }
                    dispatch(updateMethod(`category/${id}`, body)).then(res => {
                        dispatch(storeCategory())
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
            }
        } else {
            setNetErrorComponent(true);
        }
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
                    {!image ? <Icon name="plus" size={50} color={COLOUR.PRIMARY} /> : <Image source={{ uri: image }} resizeMode="cover" style={{ width: "100%", height: "100%" }} />}
                </TouchableOpacity>
                <View style={styles.formContainer}>
                    <Input
                        value={name}
                        onChangeText={data => setName(data)}
                        keyboardType={"default"}
                        placeholder="Category Name" />

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
    }
})