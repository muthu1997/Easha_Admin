/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Image,
  StyleSheet, View, DeviceEventEmitter
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as COLOUR from "./constants/colors";
import { home, home_hide, cat_hide, cat_vis, set_hide, set_vis, order_hide, order_vis, acc_hide, acc_vis } from "./constants/icons";
import NewProduct from "./src/screens/product/newProduct";
import updateProducts from "./src/screens/product/editProduct";
import AddCategory from "./src/screens/product/category";
import CategoryList from "./src/screens/product/categoryList";
import Home from "./src/screens/dashboard/dashboard";
import ProductList from "./src/screens/product/productList";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Store from "./redux/store";
import * as STRINGS from "./constants/strings";
import messaging, { firebase } from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import io from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
//Orders Tab
import OrderList from "./src/screens/orders/orderList";
import OrderData from "./src/screens/orders/orderDetails";
//Account Tab
import Account from "./src/screens/account/account";
import Profile from "./src/screens/account/profile";
import Chat from "./src/screens/account/chat";
import TandC from "./src/screens/account/tandc";
import EditProf from "./src/screens/account/editProfile";
//Delivery
import DeliveryPrice from './src/screens/delivery/deliveryList';
//Settings
import Settings from "./src/screens/settings/settings";
import PhotoSizeList from "./src/screens/settings/photoSizeList";
import AddSize from "./src/screens/settings/addSize";
import EditSize from "./src/screens/settings/editSize";
import ShopList from "./src/screens/shop/shopList";
import NewShop from "./src/screens/shop/addShop";
import UpdateShop from "./src/screens/shop/updateShop";
import MainCategory from "./src/screens/settings/mainCat";
import UpdateMainCategory from "./src/screens/settings/updateMainCat";
//Products
import GetSellerProduct from "./src/screens/product/productBySID";
//Login
import Login from "./src/screens/login/index";
//Chat
import ChatScreen from "./src/screens/chat/chat";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const configureStore = () => {
  const socket = io.connect("http://192.168.0.102:3001");
  const socketIoMiddleware = createSocketIoMiddleware(socket, "server/")
  return createStore(Store, applyMiddleware(thunk, socketIoMiddleware));
}
export default function App() {
  const [renderHome, setRenderHome] = useState("");
  useEffect(() => {
    getLocalData(false);
    const listenForLogout = DeviceEventEmitter.addListener("LOGOUT", res => {
      getLocalData(true);
    })
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        channelId: "fcm_fallback_notification_channel",
      });
    });

    return () => { listenForLogout.remove(); unsubscribe }
  }, [])

  async function requestUserPermission() {
    console.log("inside requestUserPermission")
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }

  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    if (remoteMessage) {
      console.log("onNotificationOpenedApp ", remoteMessage);
    }
  })

  messaging().setBackgroundMessageHandler(
    async (remoteMessage) => {
      if (remoteMessage) {
        console.log("setBackgroundMessageHandler ", remoteMessage);
      }
    })

  const getFcmToken = () => {
    messaging().getToken().then((fcmToken) => {
      global.fcmtoken = fcmToken;
      console.log(fcmToken)
    });
  }
  async function getLocalData(dummyData) {
    console.log("inside getLocalData")
    if (dummyData) {
      setRenderHome("");
    }
    let userId = await AsyncStorage.getItem(STRINGS.UID);
    if (userId) {
      let token = await AsyncStorage.getItem(STRINGS.TOKEN);
      if (token) {
        global.headers = true
        global.token = token;
        setRenderHome(true);
      }
    } else {
      setRenderHome(false);
    }
  }

  function HomeTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function OrderTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Orders" component={OrderList} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetails" component={OrderData} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function CategoryTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="SellerProduct" component={GetSellerProduct} options={{ headerShown: false }} />
        <Stack.Screen name="NewProduct" component={NewProduct} options={{ headerShown: false }} />
        <Stack.Screen name="EditProduct" component={updateProducts} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function AccountTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Accounts" component={Account} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginTab} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="Terms" component={TandC} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProf} options={{ headerShown: false }} />
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
        <Stack.Screen name="DeliveryCharge" component={DeliveryPrice} options={{ headerShown: false }} />
        <Stack.Screen name="ShopList" component={ShopList} options={{ headerShown: false }} />
        <Stack.Screen name="NewShop" component={NewShop} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateShop" component={UpdateShop} options={{ headerShown: false }} />
        <Stack.Screen name="MainCategoryScreen" component={MainCategory} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateMainCategoryScreen" component={UpdateMainCategory} options={{ headerShown: false }} />
        <Stack.Screen name="CategoryList" component={CategoryList} options={{ headerShown: false }} />
        <Stack.Screen name="AddCategory" component={AddCategory} options={{ headerShown: false }} />
        <Stack.Screen name="productlist" component={ProductList} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function LoginTab() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Homescreen" component={BottomTab} options={{ headerShown: false }} />
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
        <Tab.Screen name="My Products" component={CategoryTab} options={
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
  if (renderHome === "") {
    return <View style={{ flex: 1 }} />
  }
  return (
    <Provider store={configureStore()}>
      <NavigationContainer>
        <StatusBar backgroundColor={COLOUR.PRIMARY} />
        <Stack.Navigator>
          {!renderHome ? <Stack.Screen name="LoginScreen" component={LoginTab} options={{ headerShown: false }} /> :
            <Stack.Screen name="Homescreen" component={BottomTab} options={{ headerShown: false }} />}
        </Stack.Navigator>
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