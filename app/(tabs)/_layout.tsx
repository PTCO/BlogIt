import { View, Text, Image } from 'react-native'
import React from 'react'
import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { Tabs } from 'expo-router'
import  icons from '../../constants/icons'

const AuthorizedLayout = () => {

  const TabIcon = ({icon, color, name, styles, focused}) => {
    return (
      <View className={`items-center justify-center gap-2  ${focused ? 'scale-110':null}`}>
        <Image source={icon} resizeMode='contain' tintColor={color} className={`${styles}`}/>
        <Text className={`font-lobster`} style={{color: color}}>{name}</Text>
      </View>
    )
  }

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: "#D9D9D9",
      tabBarStyle: {
        height: 90,
        borderTopColor: "#284B63",
        borderTopWidth: 2,
        backgroundColor: "#284B63"
      }
    }}>
      <Tabs.Screen 
          name="home" 
          options={{
            title: 'Home',
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon icon={icons.home} color={color} name="Home" styles="w-10 h-10" focused={focused} />
            )
          }}
      />
      <Tabs.Screen name="add" options={{
        title: "Blog",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({color, focused}) => (
          <TabIcon icon={icons.add} color={color} name="Blog" styles="w-10 h-10" focused={focused} />
        )
      }}/>
      <Tabs.Screen 
          name="profile" 
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon icon={icons.profile} color={color} name="Profile" styles="w-11 h-11" focused={focused} />
            )
          }}
      />
    </Tabs>
  )
}

export default AuthorizedLayout