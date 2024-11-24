import { View, Text, Image } from 'react-native'
import React from 'react'
import icons from '../constants/icons'
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const EmptyState = () => {
  return (
    <View className="w-full justify-center  h-full items-center border-t-2 mt-5 pt-10 border-primary">
        <Image source={icons.missing} className="w-[300px] h-[300px] " resizeMode='contain'/>
        <Text className="font-opensansItalic h-[30px] text-2xl text-secondary my-2">No <Text className="text-primary-alt">blogs</Text>, be the first to create one! </Text>
        <TouchableOpacity className="h-[100px]" onPress={() => router.push('/blog/createblog')}>          
          <Text className="font-lobster border-2 border-primary p-2 rounded-xl bg-primary text-3xl text-secondary mt-3">Create One</Text>
        </TouchableOpacity>
    </View>
  )
}

export default EmptyState