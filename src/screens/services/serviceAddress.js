import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import * as COLOUR from "../../../constants/colors";
import { check } from "../../../constants/icons";
import Text from "../../../component/text";
import TitleContainer from "../../../component/titleContainer";
import Button from "../../../component/button";
import Header from "../../../component/header";
import AddressCard from "../../../component/addressCard";
import Icon from "react-native-vector-icons/Entypo";
import PaymentMethod from "../../../component/paymentMethod";
import DatePicker from 'react-native-date-picker';
import moment from "moment";

export default function Success(props) {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false);
    const [location, setLocation] = useState(global.location)
    return (
        <View style={styles.container}>
            <DatePicker
                modal
                open={open}
                date={date}
                minimumDate={new Date(moment().add(1, 'days').format("YYYY-MM-DD"))}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <Header
                back
                title="Order Process" />
            <View style={{ width: 10, height: 10 }} />
            <View style={styles.mainContainer}>
                <ScrollView>
                    <TitleContainer
                        title={"Select Address"} />
                    <View style={styles.addressContainer}>
                        <AddressCard
                        location={location}
                            onPress={() => props.navigation.navigate("AddressList")} />
                    </View>
                    <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.8} style={styles.serviceTime}>
                        <View style={{ flexDirection: "row", width: "90%" }}>
                            <View style={styles.clockIcon}>
                                <Icon name="clock" size={25} color={COLOUR.ORANGE_DARK} />
                            </View>
                            <View style={{ width: "80%" }}>
                                <Text title="Service Time" type="label" style={{ marginLeft: 10 }} />
                                <Text title={moment(date).format("ddd DD MMM YYYY hh:mm a")} type="label" lines={1} style={{ marginLeft: 10, fontSize: 12, width: "90%" }} />
                            </View>
                        </View>
                        <Icon name="chevron-thin-right" size={20} color={COLOUR.ORANGE_DARK} />
                    </TouchableOpacity>
                    <TitleContainer
                        title="Payment Methods" />
                    <PaymentMethod />
                </ScrollView>
                <View style={{ width: "100%", height: 75, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View>
                        <Text type="heading" title={`Total Amount`} />
                        <Text type="heading" title={`₹ 1200`} style={{ color: COLOUR.PRIMARY }} />
                    </View>
                    <Button title="Submit" onPress={() => props.navigation.navigate("Success")} style={{ width: "50%" }} />
                </View>
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
        height: Dimensions.get("screen").height / 4,
        alignSelf: "center"
    },
    serviceTime: {
        width: "90%",
        padding: 10,
        paddingVertical: 20,
        backgroundColor: COLOUR.CARD_BG,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        alignSelf: "center",
        borderRadius: 20
    },
    clockIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLOUR.ORANGE,
        alignItems: "center",
        justifyContent: "center"
    }
})