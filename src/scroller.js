/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {
     Dimensions,
     View
 } from 'react-native';
 import Button from '../component/button';
 import Input from '../component/inputBox';
 import { putMethod, getMethod } from '../function';
 
 class App extends React.Component {
     constructor(props) {
         super(props)
         this.state = {
            scrollertext: '',
         }
         this.getMainData();
     }

     getMainData = async () => {
         await getMethod(`scroller`, res => {
             this.setState({ scrollertext: res.result[0].message });
         })
     }
     
     setData = async () => {
         var data = {
            "message": this.state.scrollertext
        }
         await putMethod(data, res => {
             alert(res.message)
         })
     }
 
     render = () => {
         return (
             <View style={{ flex: 1, width: Dimensions.get('screen').width, alignItems: 'center', marginTop: 5 }}>
                 <Input
                     placeholder="Scroller message here"
                     onChangeText={data => this.setState({ scrollertext: data })}
                     returnKeyType="done"
                     value={this.state.scrollertext} />
                 <Button title="Save" onPress={() => this.setData()} />
             </View>
         )
     }
 
 }
 export default App;
 