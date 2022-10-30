import * as React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Text from "./text";
import { wallet, payment } from "../constants/icons";
import * as COLOUR from "../constants/colors";
const { width, height } = Dimensions.get("screen")
import { CheckboxContainer } from "../component/checkbox";
import { RadioButton } from 'react-native-paper';

const PaymentMethod = props => {
    const renderPaymentCard = (title, description, icon, status) => {
        return (
            <TouchableOpacity style={styles.paymentCard}>
                <View style={styles.titleContainer}>
                    <View style={styles.iconContainer}>
                        <Image source={icon} style={styles.icon} />
                    </View>
                    <View>
                        <Text title={title} type="label" />
                        <Text title={description} type="label" lines={1} style={{ fontSize: 12, color: COLOUR.GRAY }} />
                    </View>
                </View>
                    <RadioButton
                    color={COLOUR.PRIMARY}
                        status={status}
                    />
            </TouchableOpacity>
        )
    }
    return (
        <View style={[styles.headerContainer, props.style]}>
            <View style={styles.container}>
                {renderPaymentCard("COD", "Cash On Delivery", wallet, 'checked')}
                {renderPaymentCard("Razor Pay", "Online Payment", payment, 'unchecked')}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    paymentCard: {
        width: "100%",
        backgroundColor: COLOUR.CARD_BG,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    container: {
        flex: 1,
        borderRadius: 20,
        overflow: "hidden"
    },
    titleContainer: {
        width: "80%",
        flexDirection: "row",
        alignItems: "center"
    },
    iconContainer: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        width: 30,
        height: 30
    }
});

export default PaymentMethod;