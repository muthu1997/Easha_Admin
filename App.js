/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState} from 'react';
 import {
   StatusBar,
   Image,
   StyleSheet, Text
 } from 'react-native';
 import 'react-native-gesture-handler';
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import * as COLOUR from "./constants/colors";
 import {home, orders, account, home_back, orders_back, account_back} from "./constants/icons";
 import Corousal from "./src/screens/corousal/corousal1"
 import Corousal2 from "./src/screens/corousal/corousal2"
 import Login from "./src/screens/login";
 import NewProduct from "./src/screens/product/newProduct";
 import EditProduct from "./src/screens/product/editProduct";
 import AddCategory from "./src/screens/product/category";
 import CategoryList from "./src/screens/product/categoryList";
 import OTP from "./src/screens/register/otp";
 import RegSuccess from "./src/screens/register/regSuccess";
 import Dashboard from "./src/screens/dashboard/dashboard";
 import AllServices from "./src/screens/services/allservice";
 import ServiceDetails from "./src/screens/services/serviceDetails";
 import ServiceAddress from "./src/screens/services/serviceAddress";
 import AddressList from "./src/screens/services/addressList";
 import ProductList from "./src/screens/services/productList";
 //Orders Tab
 import OrderList from "./src/screens/orders/orderList";
 import OrderData from "./src/screens/orders/orderDetails";
 //Account Tab
 import Account from "./src/screens/account/account";
 import Profile from "./src/screens/account/profile";
 import Feedback from "./src/screens/account/feedback";
 import Language from "./src/screens/account/language";
 //Delivery
 import Delivery from "./src/screens/delivery/deliveryList";
import DeliveryPrice from './src/screens/delivery/deliveryList';
 
 const Stack = createStackNavigator();
 const Tab = createBottomTabNavigator();
 export default function App() {
  const [appStatus, setAppStatus] = useState("LOGOUT");

  function InitialTab() {
    return (
      <Stack.Navigator>
       <Stack.Screen name="Corousal" component={Corousal} options={{headerShown: false}} />
       <Stack.Screen name="Corousal2" component={Corousal2} options={{headerShown: false}} />
       <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
       <Stack.Screen name="Signup" component={NewProduct} options={{headerShown: false}} />
       <Stack.Screen name="OTP" component={OTP} options={{headerShown: false}} />
       <Stack.Screen name="RegSuccess" component={RegSuccess} options={{headerShown: false}} />
       <Stack.Screen name="HomeScreen" component={BottomTab} options={{headerShown: false}} />
     </Stack.Navigator>
    )
  }
 
   function HomeTab() {
     return (
      <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}} />
       <Stack.Screen name="OTP" component={OTP} options={{headerShown: false}} />
       <Stack.Screen name="NewProduct" component={NewProduct} options={{headerShown: false}} />
       <Stack.Screen name="EditProduct" component={EditProduct} options={{headerShown: false}} />
       <Stack.Screen name="AddCategory" component={AddCategory} options={{headerShown: false}} />
       <Stack.Screen name="CategoryList" component={CategoryList} options={{headerShown: false}} />
       <Stack.Screen name="AllService" component={AllServices} options={{headerShown: false}} />
       <Stack.Screen name="ServiceDetails" component={ServiceDetails} options={{headerShown: false}} />
       <Stack.Screen name="ServiceAddress" component={ServiceAddress} options={{headerShown: false}} />
       <Stack.Screen name="AddressList" component={AddressList} options={{headerShown: false}} />
       <Stack.Screen name="productlist" component={ProductList} options={{headerShown: false}} />
       <Stack.Screen name="DeliveryCharge" component={DeliveryPrice} options={{headerShown: false}} />
     </Stack.Navigator> 
     );
   }

   function OrderTab() {
    return (
     <Stack.Navigator>
     <Stack.Screen name="Orders" component={OrderList} options={{headerShown: false}} />
     <Stack.Screen name="Corousal" component={Corousal} options={{headerShown: false}} />
       <Stack.Screen name="OrderDetails" component={OrderData} options={{headerShown: false}} />
    </Stack.Navigator> 
    );
  }

  function AccountTab() {
    return (
     <Stack.Navigator>
     <Stack.Screen name="Account" component={Account} options={{headerShown: false}} />
     <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />
     <Stack.Screen name="Feedback" component={Feedback} options={{headerShown: false}} />
     <Stack.Screen name="Language" component={Language} options={{headerShown: false}} />
    </Stack.Navigator> 
    );
  }

   function BottomTab() {
    return (
      <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeTab} options={
        {headerShown: false,
        tabBarIcon: (data) => data.focused === true ? <Image source={home} resizeMode="contain" style={styles.icon} /> : 
        <Image source={home_back} resizeMode="contain" style={styles.icon} /> }} />
      <Tab.Screen name="My Orders" component={OrderTab} options={
        {headerShown: false,
        tabBarIcon: (data) => data.focused === true ? 
        <Image source={orders} resizeMode="contain" style={styles.icon} /> : 
        <Image source={orders_back} resizeMode="contain" style={styles.icon} /> } } />
    </Tab.Navigator>
    );
  }

  return (
     <NavigationContainer>
       <StatusBar backgroundColor={COLOUR.PRIMARY} />
        {BottomTab() }
     </NavigationContainer>
   );
 }

 const styles= StyleSheet.create({
  icon: {
    width: 25,
    height: 25
  }
 })