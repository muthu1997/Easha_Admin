
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
 
 class Button extends React.Component {
    constructor(props) {
        super(props);
      }
   render() {
     return (
         <TouchableOpacity onPress={() => this.props.onPress()} style={[styles.button,this.props.style]}>
          {this.props.loader ? <ActivityIndicator color={COLOUR.WHITE} size="small" /> : 
             <Text style={[styles.btntxt, this.props.textStyle]}>{this.props.title}</Text> }
         </TouchableOpacity>
     )
   }
 }

 const styles = StyleSheet.create({
    button: {
        width: '70%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOUR.PRIMARY,
        borderRadius: 10,
    },
    btntxt: {
      fontWeight: '700',
      color: '#FFFF'
    }
 })
 export default Button;
 