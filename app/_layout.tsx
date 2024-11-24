import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import GlobalProvider from '../context/GlobalProvider';



const RootLayout = () => {
  const [fontsLoaded, error ] = useFonts({
    "SpaceMono-Regular": require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Lobster-Regular": require('../assets/fonts/Lobster-Regular.ttf'),
    "OpenSans_Condensed-Italic": require('../assets/fonts/OpenSans_Condensed-Italic.ttf'),
    "OpenSans_Condensed-Regular": require('../assets/fonts/OpenSans_Condensed-Regular.ttf'),
  })

  useEffect(()=>{
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if(!error && !fontsLoaded) return null;

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        <Stack.Screen name="(auth)" options={{headerShown: false}}/>
        <Stack.Screen name="search/[query]" options={{headerShown: false}}/>
        <Stack.Screen name="blog/[query]" options={{headerShown: false}}/>
        <Stack.Screen name="blog/userblogs" options={{headerShown: false}}/>
        <Stack.Screen name="blog/savedblogs" options={{headerShown: false}}/>
        <Stack.Screen name="blog/createblog" options={{headerShown: false}}/>
        <Stack.Screen name="blog/editblog" options={{headerShown: false}}/>
      </Stack>
    </GlobalProvider>
  )
}

export default RootLayout