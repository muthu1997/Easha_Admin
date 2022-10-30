import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import * as COLOUR from "../../../constants/colors";
import TitleContainer from "../../../component/titleContainer";
import Header from "../../../component/header";
import AddressCard from "../../../component/addressCard";
import Icon from "react-native-vector-icons/Entypo";

const address = [{ id: 1 }, { id: 2 }, { id: 3 }];

export default function AddressList(props) {

    return (
        <View style={styles.container}>
            <Header
                back
                title="My Address" />
            <View style={{ width: 10, height: 10 }} />
            <View style={styles.mainContainer}>
                <TitleContainer
                    title="Select Service Address"
                    addButton />
                
                    <FlatList
                    data={address}
                    renderItem={({item, index}) => {
                        return <View elevation={3} style={styles.addressContainer}>
                            <AddressCard
                            edit />
                            </View>
                    }}
                    keyExtractor={item => item.id} />
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.LIGHTBG
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLOUR.WHITE,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingTop: 10
    },
    addressContainer: {
        width: "90%",
        height: Dimensions.get("screen").height / 5,
        marginVertical: 5,
        alignSelf: "center",
        backgroundColor: COLOUR.WHITE,
        borderRadius: 20
    }
})