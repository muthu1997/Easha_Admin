/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {
   StatusBar
 } from 'react-native';
 import 'react-native-gesture-handler';
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import * as COLOUR from "./constants/colors";
 
 import Corousal from "./src/screens/corousal/corousal1"
 import Corousal2 from "./src/screens/corousal/corousal2"
 import Login from "./src/screens/login";
 import Signup from "./src/screens/register/signup";
 import OTP from "./src/screens/register/otp";
 import RegSuccess from "./src/screens/register/regSuccess";
 import Dashboard from "./src/screens/dashboard/dashboard";
 import AllServices from "./src/screens/services/allservice";
 
 const Stack = createStackNavigator();
 const Tab = createBottomTabNavigator();
 export default function App() {
 
   function BottomTabFunction() {
     return (
       <Tab.Navigator>
         <Tab.Screen name="Home" component={HomeScreen} />
         <Tab.Screen name="Settings" component={SettingsScreen} />
       </Tab.Navigator>
     );
   }
   
   return (
     <NavigationContainer>
       <StatusBar backgroundColor={COLOUR.PRIMARY} />
       <Stack.Navigator>
       <Stack.Screen name="Corousal" component={Corousal} options={{headerShown: false}} />
       <Stack.Screen name="Corousal2" component={Corousal2} options={{headerShown: false}} />
       <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
       <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} />
       <Stack.Screen name="OTP" component={OTP} options={{headerShown: false}} />
       <Stack.Screen name="RegSuccess" component={RegSuccess} options={{headerShown: false}} />
       <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}} />
       <Stack.Screen name="AllService" component={AllServices} options={{headerShown: false}} />
     </Stack.Navigator>  
     </NavigationContainer>
   );
 }