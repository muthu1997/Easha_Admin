import React, { useState, useReducer, useEffect } from "react";
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import CategoryContainer from "../../../component/categoryContainer";
import TitleContainer from "../../../component/titleContainer";
import Services from "../../../component/Services";
import Asset from "../../../component/assetList";
import Geolocation from '@react-native-community/geolocation';
import {Products} from "../../../dummy";
const Options = [

    {
        id: 1,
        name: "Categories",
        icon: "more",
        screen: "CategoryList"
    },
    {
        id: 2,
        name: "Products",
        icon: "cart",
        screen: "productlist"
    },
    {
        id: 3,
        name: "Delivery Price",
        icon: "currency-rupee",
        screen: "DeliveryCharge"
    }
]
export default function Dashboard(props) {
    const [location, setLocation] = useState(null);
    useEffect(() => {
        // global.language = "English";
        // getLocation();
    },[])
    const getLocation = async() => {
        await Geolocation.getCurrentPosition(position => {
            global.location = {latitude: position.coords.latitude, longitude: position.coords.longitude};
            setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={COLOUR.WHITE} barStyle="dark-content" />
            <Header 
              name
            />
            <View style={{marginTop: 10}} />
            <Services
            onPress={(item) => props.navigation.navigate(item.screen)}
            data={Options} />
        </View>
    )
}

let width = Dimensions.get("screen").width - 40;
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})