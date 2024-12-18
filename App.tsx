import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import { setGlobalFont } from './src/utils/fonts';
import { Buffer } from 'buffer';
import SessionStorage from 'react-native-session-storage';

const Stack = createNativeStackNavigator();


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({})

  useEffect(() => {
    const token = SessionStorage.getItem('@token_data');
    if (token) {
      const parts = token.split('.').map((part:any) => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
      const payload = JSON.parse(parts[1]);
      console.log('JWT payload', payload);
      setUserProfile(payload)
      setIsLoggedIn(true)
    }
    setGlobalFont('Inter-Regular');
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
      {/* <Stack.Navigator initialRouteName={'Login'}> */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
