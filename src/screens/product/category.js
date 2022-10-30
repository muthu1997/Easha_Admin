import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity, Image } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { postMethod, putMethod, uploadImage } from "../../../function";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

export default function SignupFunction(props) {
    const [name, setName] = useState("");
    const [loader, setLoader] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [image, setImage] = React.useState("");
    const [id, setId] = React.useState("");

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

    function submitCategory() {
        if (image === "") {
            alert("Image required...")
        } else if (name === "") {
            alert("Name required....")
        } else {
            setLoader(true)
            uploadImage(image, name, response => {
                if (response != "error") {
                    let body = {
                        "name": name,
                        "image": response
                    }
                    postMethod('category/newcategory', body, res => {
                        if (res !== "error") {
                            setName("");
                            setImage("");
                            if (!checked) {
                                props.navigation.goBack()
                            }
                        } else {
                            alert("Something went wrong.")
                        }
                        setLoader(false)
                    })
                } else {
                    alert("Something went wrong.")
                    setLoader(false)
                }
            })
            
        }
    }

    function updateCategory() {
        if (image === "") {
            alert("Image required...")
        } else if (name === "") {
            alert("Name required....")
        } else {
            setLoader(true)
            uploadImage(image, name, response => {
                console.log(response)
                if (response != "error") {
                    let body = {
                        "name": name,
                        "image": response
                    }
                    putMethod(`category/${id}`, body, res => {
                        if (res !== "error") {
                            setName("");
                            setImage("");
                            props.navigation.goBack()
                        } else {
                            alert("Something went wrong.")
                        }
                        setLoader(false)
                    })
                } else {
                    alert("Something went wrong.")
                    setLoader(false)
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle="dark-content" />
            <View style={styles.headingContainer}>
                <Text title={props.route.params.type === "edit" ? "Edit Category" : "New Category"} type="title" style={{ fontSize: 28 }} />
            </View>
            <TouchableOpacity onPress={() => imageHandler()} activeOpacity={9} style={styles.imageButton} >
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: COLOUR.WHITE,
        paddingHorizontal: '10%'
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
        borderWidth: 2,
        borderColor: COLOUR.PRIMARY,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center"
    }
})