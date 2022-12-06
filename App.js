/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  StatusBar,
  Image,
  StyleSheet, NativeModules
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as COLOUR from "./constants/colors";
import { home, home_hide, cat_hide, cat_vis, set_hide, set_vis, order_hide, order_vis, acc_hide, acc_vis } from "./constants/icons";
import NewProduct from "./src/screens/product/newProduct";
import EditProduct from "./src/screens/product/editProduct";
import AddCategory from "./src/screens/product/category";
import CategoryList from "./src/screens/product/categoryList";
import Home from "./src/screens/dashboard/dashboard";
import ProductList from "./src/screens/product/productList";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import Store from "./redux/store";
//Orders Tab
import OrderList from "./src/screens/orders/orderList";
import OrderData from "./src/screens/orders/orderDetails";
//Account Tab
import Account from "./src/screens/account/account";
import Profile from "./src/screens/account/profile";
//Delivery
import DeliveryPrice from './src/screens/delivery/deliveryList';
//Settings
import Settings from "./src/screens/settings/settings";
import PhotoSizeList from "./src/screens/settings/photoSizeList";
import AddSize from "./src/screens/settings/addSize";
import EditSize from "./src/screens/settings/editSize";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const configureStore = createStore(Store, applyMiddleware(thunk));
export default function App() {

  function HomeTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="DeliveryCharge" component={DeliveryPrice} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function OrderTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Orders" component={OrderList} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetails" component={OrderData} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function CategoryTab() {
    return (
      <Stack.Navigator>
      <Stack.Screen name="CategoryList" component={CategoryList} options={{ headerShown: false }} />
      <Stack.Screen name="NewProduct" component={NewProduct} options={{ headerShown: false }} />
      <Stack.Screen name="EditProduct" component={EditProduct} options={{ headerShown: false }} />
      <Stack.Screen name="AddCategory" component={AddCategory} options={{ headerShown: false }} />
      <Stack.Screen name="productlist" component={ProductList} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function AccountTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Accounts" component={Account} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function SettingsTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Setting" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="PhotoSizeList" component={PhotoSizeList} options={{ headerShown: false }} />
        <Stack.Screen name="AddSize" component={AddSize} options={{ headerShown: false }} />
        <Stack.Screen name="EditSize" component={EditSize} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function BottomTab() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={HomeTab} options={
          {
            headerShown: false,
            tabBarIcon: (data) => data.focused === true ? <Image source={home} resizeMode="contain" style={styles.icon} /> :
              <Image source={home_hide} resizeMode="contain" style={styles.icon} />
          }} />
        <Tab.Screen name="Categories" component={CategoryTab} options={
          {
            headerShown: false,
            tabBarIcon: (data) => data.focused === true ? <Image source={cat_vis} resizeMode="contain" style={styles.icon} /> :
              <Image source={cat_hide} resizeMode="contain" style={styles.icon} />
          }} />
        <Tab.Screen name="My Orders" component={OrderTab} options={
          {
            headerShown: false,
            tabBarIcon: (data) => data.focused === true ?
              <Image source={order_vis} resizeMode="contain" style={styles.icon} /> :
              <Image source={order_hide} resizeMode="contain" style={styles.icon} />
          }} />
        <Tab.Screen name="Settings" component={SettingsTab} options={
          {
            headerShown: false,
            tabBarIcon: (data) => data.focused === true ? <Image source={set_vis} resizeMode="contain" style={styles.icon} /> :
              <Image source={set_hide} resizeMode="contain" style={styles.icon} />
          }} />
        <Tab.Screen name="Account" component={AccountTab} options={
          {
            headerShown: false,
            tabBarIcon: (data) => data.focused === true ?
              <Image source={acc_vis} resizeMode="contain" style={styles.icon} /> :
              <Image source={acc_hide} resizeMode="contain" style={styles.icon} />
          }} />
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={configureStore}>
      <NavigationContainer>
        <StatusBar backgroundColor={COLOUR.PRIMARY} />
        {BottomTab()}
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25
  }
})