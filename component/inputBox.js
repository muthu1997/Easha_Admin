
 import React from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   TextInput
 } from 'react-native';
 import * as COLOUR from "../constants/colors";

 function Input(props) {
  const color = COLOUR.LIGHTGRAY;
     return (
         <TextInput 
         placeholder={props.placeholder}
         placeholderTextColor={COLOUR.GRAY}
         value={props.value}
         onChangeText={(data) => props.onChangeText(data)}
        //  onBlur={() => {
        //   this.setState({color: COLOUR.LIGHTGRAY})
        //    props.onBlur ? props.onBlur() : console.log('onblur')
        //  }}
        ref={props.ref ? props.ref : null}
        autoFocus={props.autoFocus ? props.autoFocus : false}
         secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
         onSubmitEditing={() => props.onSubmitEditing ? props.onSubmitEditing() : null}
         returnKeyType={props.returnKeyType}
         keyboardType={props.keyboardType}
         multiline={props.multiline ? true : false}
         style={[styles.button, {borderColor: color},props.style]} 
        />
     )
 }

 const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        borderWidth: 2,
        paddingLeft: 10,
        borderRadius: 10,
        color: COLOUR.BLACK
    }
 })
 export default Input;
 