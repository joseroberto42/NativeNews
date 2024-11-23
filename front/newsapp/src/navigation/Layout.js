import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewsList from '../../screens/NewsList';
import LoginScreen from '../../screens/LoginScreen';

const Tab = createBottomTabNavigator();

const Layout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Tab.Navigator>
          <Tab.Screen name="News" component={NewsList} />
          <Tab.Screen name="Login" component={LoginScreen} />
        </Tab.Navigator>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // Permite rolagem, mesmo que o conteúdo não ocupe toda a altura
  },
});

export default Layout;

