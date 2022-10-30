
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as COLOUR from "../constants/colors";
class MultiBtn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mainData: this.props.mainData,
      type: ''
    }
  }

  setItem=(data) => {
    this.setState({type: data.value ? data.value : data.name});
    this.props.onChangeText(data)
  }

  render() {
    return (
      <View style={{width: '100%', height: 70, justifyContent: 'center'}}>
        <Text style={{paddingHorizontal:5, fontWeight: '700', fontSize: 16}}>Type: {this.state.type}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {this.state.mainData.map(item => {
            return <TouchableOpacity style={[styles.btn,{backgroundColor: this.state.type === item.value ? COLOUR.PRIMARY : "#ffff"}]} key={item.title} onPress={() => this.setItem(item)}>
              <Text >{item.title ? item.title : item.name}</Text>
            </TouchableOpacity>
          })}
        </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  btn: {
    padding:5,
    margin: 5,
    borderRadius: 5,
    borderWidth: 0.6,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default MultiBtn;
