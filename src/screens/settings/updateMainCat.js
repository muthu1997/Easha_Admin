import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image, ToastAndroid, Modal, Alert, Dimensions } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { updateMethod, storeMainCategory, postMethodFunction, deleteImageFromAWS } from "../../../redux/actions";
import { CropView } from 'react-native-image-crop-tools';
import { imageSizeHandler } from "../../../utils/imageHandler";
import { awsuploadImageToBucket } from "../../../utils/awsconfig"
/* basic imports */
import { FailureComponent } from "../mascelinous/requestFail";
import { isInternetConnection } from "../../../utils/checkInternet";
import { useDispatch } from "react-redux";
import { failure, net_failure } from "../../../constants/icons";
import Header from "../../../component/header";
const { width, height } = Dimensions.get("screen");

export default function EditMainCategoryScreen(props) {
    const [name, setName] = useState("");
    const [loader, setLoader] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [id, setId] = React.useState("");
    /* loader and error components */
    const [showErrorComponent, setErrorComponent] = useState(false)
    const [showNetErrorComponent, setNetErrorComponent] = useState(false)
    const dispatch = useDispatch();
    const data = props.route.params.data

    useEffect(() => {
        if (props.route.params.type === "edit") {
            setName(data.name);
            setId(data._id);
        } else {
            setName("");
        }
    }, [])

    async function submitCategory() {
        if (await isInternetConnection()) {
            if (name === "") {
                ToastAndroid.show("Name required...", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            } else {
                setLoader(true);
                let body = {
                    "name": name
                }
                dispatch(postMethodFunction(`maincategory/new`, body)).then(res => {
                    dispatch(storeMainCategory())
                    setName("");
                    if (!checked) {
                        props.navigation.goBack()
                    }
                    setLoader(false)
                }).catch(err => {
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
            if (name === "") {
                ToastAndroid.show("Name required...", ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT)
            } else {
                setLoader(true);
                let body = {
                    "name": name
                }
                dispatch(updateMethod(`maincategory/${id}`, body)).then(res => {
                    dispatch(storeMainCategory())
                    setName("");
                    props.navigation.goBack()
                    setLoader(false)
                }).catch(err => {
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
                title={props.route.params.type === "edit" ? "Edit Main Category" : "Add Main Category"}
            />
            <View style={styles.mainContainer}>
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
    },
    cropViewContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOUR.BLACK
    }
})