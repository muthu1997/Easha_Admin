/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {
   Alert,
   FlatList,
   Dimensions,
   Text,
   View,
 } from 'react-native';
 import MultiBtn from '../component/groupBtn';
 import { deleteMethod, getMethod } from '../function';
 
 class App extends React.Component {
   constructor(props) {
     super(props)
     this.state = {
       page: 'list',
       listData: [],
       listType: 'news',
     }
     this.getMainData();
   }
 
   getMainData = async () => {
     await getMethod(this.state.listType, res => {
       this.setState({ listData: res.result });
     })
   }
 
   deleteData = async (id) => {
     await deleteMethod(id, res => {
       alert('Deleted successfully');
       this.getMainData();
     })
   }
 
   render = () => {
     return (
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <View style={{ width: '100%' }}>
           <MultiBtn
             onChangeText={data => this.setState({ listType: data }, function () { this.getMainData() })}
             mainData={[{ title: 'NEWS', value: 'news' },
             { title: 'FUNCTIONS', value: 'function' },
             { title: 'E-SERVICE', value: 'eservice' },
             { title: 'CONTACT', value: 'contact' },
             { title: 'DEATH', value: 'death' },
             { title: 'HISTORY', value: 'history' },
             { title: 'DOCUMENTS', value: 'documetn' },
             { title: 'GALLERY', value: 'gallery' },
             { title: 'JOB', value: 'job' }]} />
         </View>
         <FlatList
           data={this.state.listData}
           renderItem={({ item, index }) => {
             return (
               <View style={{ width: Dimensions.get('screen').width / 1.1, backgroundColor: 'rgba(255,255,255,0.7)', padding: 5, marginVertical: 3, borderRadius: 5, borderWidth: 0.5, borderColor: 'lightgray' }}>
                 {item.title ? <Text style={{ fontWeight: '700' }}>{item.title}</Text> : null}
                 {item.name ? <Text>{item.name}</Text> : null}
                 {item.mobile ? <Text>{item.mobile}</Text> : null}
                 {item.description ? <Text numberOfLines={4}>{item.description}</Text> : null}
                 {item.designation ? <Text>{item.designation}</Text> : null}
                 {item.date ? <Text>{item.date}</Text> : null}
                 <Text onPress={() => Alert.alert('', 'Are you sure want to delete the data', [
                   {
                     text: 'DELETE',
                     onPress: () => this.deleteData(item._id)
                   },
                   {
                     text: 'CANCEL'
                   }
                 ])} style={{ color: 'red', fontWeight: 'bold' }}>DELETE</Text>
               </View>
             )
           }}
           keyExtractor={item => item._id}
         />
       </View>
     )
   }
 }
 export default App;
 