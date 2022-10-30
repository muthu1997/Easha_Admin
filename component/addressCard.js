import * as React from 'react';
import * as COLOUR from "../constants/colors";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/Entypo";
import Text from "../component/text";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const AddressCard = props => {
    return (
        <View style={styles.constainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={props.onPress} style={styles.titleContainer}>
                <View style={{ flexDirection: "row", width: "90%" }}>
                    <View style={styles.locationIcon}>
                        <Icon name="location-pin" size={25} color={COLOUR.PRIMARY} />
                    </View>
                    <View style={{ width: "80%" }}>
                        <Text title="Service Location" type="label" style={{ marginLeft: 10 }} />
                        <Text title="210, First street, Agarappatti, Rajagopalapuram Post, Pudukkottai, 622003" type="label" lines={1} style={{ marginLeft: 10, fontSize: 12, width: "90%" }} />
                    </View>
                </View>
                {props.edit ? 
                <Icon name="edit" size={20} color={COLOUR.PRIMARY} /> : 
                <Icon name="chevron-thin-right" size={20} color={COLOUR.PRIMARY} /> }
            </TouchableOpacity>
            <View style={styles.mapContainer}>
            {props.location ? <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={
                        // props.location ? props.location : 
                        {
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                        title={"Muthukumar"}
                        description={"210, First street, Agarappatti...."}
                    />
                </MapView> : null }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    constainer: {
        width: "100%",
        height: "100%",
        backgroundColor: COLOUR.WHITE,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLOUR.CARD_BG
    },
    titleContainer: {
        width: "100%",
        padding: 10,
        backgroundColor: COLOUR.CARD_BG,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    locationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLOUR.SECONDARY_LIGHT,
        alignItems: "center",
        justifyContent: "center"
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {
        flex: 1
    }
});

export default AddressCard;