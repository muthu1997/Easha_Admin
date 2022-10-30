import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "./text";
import * as COLOUR from "../constants/colors";

const TitleContainer = props => {
  return (
      <View style={[styles.headerContainer, props.style]}>
          <View style={{flexDirection: "row", alignItems:'center', justifyContent:'space-between', width: "100%"}}>
            <Text title={props.title} type="heading" style={{fontSize: 20}} />
            {props.secondaryTitle ? <Text onPress={() => props.onViewAll ? props.onViewAll() : null} title={props.secondaryTitle} type="label" style={{color: COLOUR.GRAY, fontWeight: "500"}} /> : null }
            {props.addButton ? <TouchableOpacity activeOpacity={0.8} style={styles.addButton}>
              <Icon name="plus" size={20} color={COLOUR.WHITE} />
            </TouchableOpacity> : null }
          </View>
      </View>
  );
} 
 
const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems:'center',
        justifyContent:'space-between',
        padding: 20,
        marginVertical: 5
  },
  addButton: {
    width: 35,
    height: 35,
    borderRadius: 25,
    alignItems:'center',
    justifyContent:"center",
    backgroundColor: COLOUR.PRIMARY
  }
});

export default TitleContainer;