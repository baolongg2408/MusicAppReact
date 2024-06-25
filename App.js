import React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/Navigation/BottomNavigation'; 
import SplatScreen from './src/Screens/SplatScreen';


const App = () => {
const[isVisible,setvisible] = useState(true);

useEffect(()=>{
  const timer = setTimeout(()=>{
    setvisible(false);
  },2000);

  return ()=>clearTimeout(timer);
},[])

  return (
    <NavigationContainer>
      {isVisible? <SplatScreen/> :  <BottomTabNavigator />}   
    </NavigationContainer>
  );
};

export default App;
