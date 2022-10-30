import * as React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "./text";
import * as COLOUR from "../constants/colors";
import {fanimage, acimage, wmachine, fridgeimage} from "../constants/icons";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const {width, height} = Dimensions.get("screen")

const DashboardOrder = props => {
    return (
        <View style={[styles.headerContainer, props.style]}>
           <FlatList
                data={props.data}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(item)} style={styles.card}>
                        <View style={styles.catIcon}>
                            <Icon name={item.icon} size={45} color={COLOUR.PRIMARY} />
                        </View>
                        <Text type="heading" title={item.name} style={styles.catText} />
                    </TouchableOpacity>
                }}
                keyExtractor={item => item.id} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    card: {
        width: width / 2.6,
        backgroundColor: COLOUR.CARD_BG,
        margin: 5,
        borderRadius: 10,
        justifyContent: "center",
        paddingVertical: 30,
        alignItems: "center",
        justifyContent:"center",
        elevation: 1
    },
    catIcon: {
        width: "100%",
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    catText: {
        color: COLOUR.PRIMARY
    }
});

export default DashboardOrder;