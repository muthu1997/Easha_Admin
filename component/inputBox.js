
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

 class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          color: COLOUR.LIGHTGRAY
        }
      }
   render() {
     return (
         <TextInput 
         placeholder={this.props.placeholder}
         placeholderTextColor={COLOUR.GRAY}
         value={this.props.value}
         onChangeText={(data) => this.props.onChangeText(data)}
        //  onBlur={() => {
        //   this.setState({color: COLOUR.LIGHTGRAY})
        //    this.props.onBlur ? this.props.onBlur() : console.log('onblur')
        //  }}
         secureTextEntry={this.props.secureTextEntry}
         keyboardType={this.props.keyboardType}
         multiline={this.props.multiline ? true : false}
         style={[styles.button, {borderColor: this.state.color},this.props.style]} 
        />
     )
   }
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
 