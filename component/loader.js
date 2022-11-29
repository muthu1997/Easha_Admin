import React from "react";
import { ActivityIndicator } from "react-native-paper";
import * as COLOUR from "../constants/colors";

export default function Loader(props) {
    return <ActivityIndicator size={props.size ? props.size : "large"} color={props.color ? props.color : COLOUR.PRIMARY} />
}