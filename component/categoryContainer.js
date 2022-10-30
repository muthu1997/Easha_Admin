import React, {useState} from 'react';
import { StyleSheet, FlatList, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Text from "./text";
import * as COLOUR from "../constants/colors";
import { install, repair, service } from "../constants/icons";
const { width, height } = Dimensions.get("screen");
const categories = [
    {
        title: "Repair",
        icon: repair
    },
    {
        title: "Service",
        icon: service
    },
    {
        title: "Install",
        icon: install
    }
]

const ProfileContainer = props => {
    const [getSelected, setSelected] = useState(0);

    function selectFunction(index) {
        setSelected(index)
    }
    return (
        <View style={[styles.headerContainer, props.style]}>
            <View style={styles.backgroundStyle} />
            <FlatList
                data={categories}
                horizontal
                renderItem={({ item, index }) => {
                    return <TouchableOpacity activeOpacity={0.8} onPress={() => selectFunction(index)} style={[styles.card, {backgroundColor: getSelected === index ? COLOUR.SELECTED_COLOUR : COLOUR.CARD_BG}]}>
                        <View style={styles.catIcon}>
                            <Image source={item.icon} resizeMode="contain" style={{width: "80%", height: "60%"}} />
                        </View>
                        <Text type="paragraph" title={item.title} style={[styles.catText,{color: getSelected === index ? COLOUR.WHITE : COLOUR.DARK_BLUE}]} />
                    </TouchableOpacity>
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    backgroundStyle: {
        width: "100%",
        height: "50%",
        backgroundColor: COLOUR.LIGHTBG,
        position: "absolute",
        top: 0,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 100
    },
    card: {
        width: width / 4.5,
        height: width / 3.5,
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1
    },
    catIcon: {
        width: width / 8.5,
        height: width / 8.5,
        backgroundColor: COLOUR.LIGHTBG,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    catText: {
        marginTop: 10,
    }
});

export default ProfileContainer;