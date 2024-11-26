// src/navigation/AuthStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import Layout from './Layout';
import NewsList from '../../screens/NewsList';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="News" component={NewsList} />
      <Stack.Screen name="Tabs" component={Layout} />
    </Stack.Navigator>
  );
};


export default AuthStack;
