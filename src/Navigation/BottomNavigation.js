import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import PlayScreen from '../Screens/PlayScreen';
import SettingScreen from '../Screens/SettingScreen';
import GenreSongsScreen from '../Screens/GenreSongScreen';
import FavoriteListScreen from '../Screens/FavoriteScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faPlay, faCog } from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();
const stack = createStackNavigator();

const HomeStackScreen = () => (
  <stack.Navigator screenOptions={{ headerShown: false }}>
    <stack.Screen name="House" component={HomeScreen} />
    <stack.Screen name="GenreSongs" component={GenreSongsScreen} />
    <stack.Screen name='FavoriteListScreen' component={FavoriteListScreen}/>
  </stack.Navigator>
);


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? faHome : faHome;
          } else if (route.name === 'Play') {
            iconName = focused ? faPlay : faPlay;
          } else if (route.name === 'Setting') {
            iconName = focused ? faCog : faCog;
          }

          // Return FontAwesomeIcon component with appropriate icon
          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white', // Color when tab is active
        tabBarInactiveTintColor: '#c4f649', // Color when tab is inactive
        tabBarStyle: {
          backgroundColor: '#000',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 15,
        },
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTitleStyle: {
          fontSize: 23,
          color: '#c4f649',
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Play" component={PlayScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
