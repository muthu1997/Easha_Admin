import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Image, ToastAndroid } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { technecian } from "../../../constants/icons";
import GroupBtn from "../../../component/groupBtn";
import Text from "../../../component/text";
import Button from "../../../component/button";
import Input from "../../../component/inputBox";
import { Checkbox } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { launchImageLibrary } from 'react-native-image-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import RNFetchBlob from 'rn-fetch-blob';
import {postMethod, uploadImage, putMethod} from "../../../utils/function";
import moment from "moment";

export default function SignupFunction(props) {
    const proData = props.route.params.data;
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [height, setHeight] = useState("");
    const [width, setWidth] = useState("");
    const [image, setImage] = React.useState("");
    const [imageStatus, setImageStatus] = React.useState(false);
    const [sizeType, setSizeType] = React.useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [deliveryPrice, setDelivaryPrice] = useState("");
    const [submitLoader, setSubmitLoader] = React.useState(false);
    const refRBSheet = useRef();

    useEffect(() => {
        let data = props.route.params.data;
        console.log(data)
        setName(data.name);
        setDescription(data.description);
        setPrice(String(data.price));
        setHeight(String(data.height));
        setWidth(String(data.width));
        setImage(data.image);
        setSizeType(data.type);
        setSelectedCategory(data.category)
    },[])

    function submitProduct() {
        if(name === "" || description === "" || price === "" || height === "" || width === "" || image === "" || sizeType === "" || selectedCategory === "") {
            alert("Enter all the fields to continue....")
        }else {
            if(imageStatus === true) {
                console.log("1")
                submitWithImage();
            }else {
                console.log("2")
                submitWithoutImage();
            }
        }
    }

    function submitWithImage() {
        uploadImage(image, name+`_${moment()}`, response => {
            if (response != "error") {
        let body = {
            "name": name,
            "description": description,
            "price": Number(price),
            "width": Number(width),
            "height": Number(height),
            "type": sizeType,
            "deliveryPrice": 500,
            "category": selectedCategory._id,
            "image": response
        }
        
        setSubmitLoader(true)
        putMethod(`product/${proData._id}`,body, res => {
            if(res !== "error") {
                console.log("Updated")
                ToastAndroid.show("Product updated...", ToastAndroid.BOTTOM, ToastAndroid.SHORT);
            }else {
                alert("Something went wrong.")
            }
            setSubmitLoader(false)
        })
    } else {
        alert("Something went wrong.")
        setSubmitLoader(false)
    }
})
    }

    function submitWithoutImage() {
        let body = {
            "name": name,
            "description": description,
            "price": Number(price),
            "width": Number(width),
            "height": Number(height),
            "type": sizeType,
            "deliveryPrice": 500,
            "category": selectedCategory._id
        }
        
        setSubmitLoader(true)
        putMethod(`product/${proData._id}`,body, res => {
            if(res !== "error") {
                console.log("Updated")
                ToastAndroid.show("Product updated...", ToastAndroid.BOTTOM, ToastAndroid.SHORT);
            }else {
                alert("Something went wrong.")
            }
            setSubmitLoader(false)
        })
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
                        console.log("Size: ",(stats.size / 1024 / 1024))
                        if ((stats.size / 1024 / 1024) > 1) {
                            alert("Photo not allowed Greater than 1 MB");
                        } else {
                            setImageStatus(true);
                            setImage(`${response.assets[0].uri}`);
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
            style={{width: "45%", backgroundColor: sizeType === title ? COLOUR.PRIMARY : COLOUR.DARK_GRAY}} 
            title={title}
            onPress={() => {
                setSizeType(title)
            }}
             />
        )
    }

    const renderCategoryList = () => {
        let data = props.route.params.categoryList;
        return (
            <View style={styles.btmSheetContainer}>
            <FlatList
            numColumns={3}
            data = {data}
            renderItem = {({item, index}) => {
                return (
                    <Button 
                    title={item.name}
                    onPress={() => {
                            setSelectedCategory(item); 
                            refRBSheet.current.close()
                            }}
                            style={{paddingHorizontal: 10, margin: 5, paddingVertical: 5, borderRadius: 5, borderWidth: 2, borderColor: COLOUR.PRIMARY, width: "30%"}} />
                )
            }}
            keyExtractor={item => item._id}
            />
            </View>

        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle="dark-content" />
            <ScrollView style={{width: "100%"}} showsVerticalScrollIndicator={false}>
            <View style={styles.headingContainer}>
                <Text title="Update Product" type="title" style={{ fontSize: 28 }} />
            </View>
            <TouchableOpacity onPress={() => imageHandler()} activeOpacity={9} style={styles.imageButton} >
            {!image ? <Icon name="plus" size={50} color={COLOUR.PRIMARY} /> : <Image source={{uri: image}} style={{width: "100%", height: "100%"}} resizeMode="cover" /> }
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
                    style={{height: 100, textAlignVertical: 'top'}}
                    placeholder="Description" />
                <Input
                    value={price}
                    onChangeText={data => setPrice(data)}
                    keyboardType={"number-pad"}
                    placeholder="Price" />
                    <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
                <Input
                    style={{width: "48%"}}
                    value={width}
                    onChangeText={data => setWidth(data)}
                    keyboardType={"number-pad"}
                    placeholder="Photo width" />
                <Input
                    style={{width: "45%"}}
                    value={height}
                    onChangeText={data => setHeight(data)}
                    keyboardType={"number-pad"}
                    placeholder="Photo height" />

                    </View>
                    <Button title={selectedCategory ? selectedCategory.name : "Select category"} onPress={() => refRBSheet.current.open()} style={[styles.categoryButton, {borderColor: selectedCategory ? COLOUR.PRIMARY : COLOUR.DARK_GRAY}]} textStyle={{ color: COLOUR.BLACK }} />
                    <View style={{width: "100%", height: 50, flexDirection:"row", alignItems: "center", justifyContent:"space-between"}}>
                        {renderOptionButton("FEET")}
                        {renderOptionButton("INCH")}
                    </View>
                <Button title="Create" loader={submitLoader} onPress={() => submitProduct()} style={[styles.buttonStyle,{marginBottom: 10}]} textStyle={{ color: COLOUR.WHITE }} />
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
        borderWidth:2,
        borderColor: COLOUR.PRIMARY,
        overflow: "hidden",
        alignItems:"center",
        justifyContent:"center",
        alignSelf:"center"
    },
    btmSheetContainer: {
        flex: 1,
        alignItems:"center"
    }
})