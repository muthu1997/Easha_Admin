import * as React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Text from "./text";
import * as COLOUR from "../constants/colors";

const MainContainer = props => {
  return (
      <SafeAreaView style={[styles.headerContainer, props.style]}>

      </SafeAreaView>
  );
} 
 
const styles = StyleSheet.create({
    headerContainer: {
        flex:1,
        backgroundColor: COLOUR.WHITE
  }
});

export default MainContainer;