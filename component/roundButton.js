
 import React from 'react';
 import {
   SafeAreaView,
   ScrollView,
   ActivityIndicator,
   StyleSheet,
   Text,
   useColorScheme,
   TouchableOpacity,
   View,
 } from 'react-native';
 import * as COLOUR from "../constants/colors";
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
 
 class RoundButton extends React.Component {
    constructor(props) {
        super(props);
      }
   render() {
     return (
         <TouchableOpacity onPress={() => this.props.onPress()} style={[styles.button,this.props.style]}>
          {this.props.loader ? <ActivityIndicator color={COLOUR.WHITE} size="small" /> : 
             <Icon name={this.props.icon} size={20} color={this.props.color ? this.props.color : COLOUR.WHITE} /> }
         </TouchableOpacity>
     )
   }
 }

 const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOUR.PRIMARY,
        borderRadius: 25,
    },
    btntxt: {
      fontWeight: '700',
      color: '#FFFF'
    }
 })
 export {RoundButton};
 