import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

const GlobalFooter = () => {
  return (
    <View className="d-flex flex-row w-full items-center justify-evenly pb-4 ">
        <Text className="text-secondary border-right">&copy; Copywright of <Text className="font-lobster">DTCO</Text></Text>
        <TouchableOpacity onPress={() => router.push('https://www.termsfeed.com/live/04cb887c-f3ef-4ed9-8e22-4867d90bb894')}>
            <Text className="text-secondary font-lobster border border-primary-alt p-1 rounded pb-0">Privacy</Text>
        </TouchableOpacity>
    </View>
  )
}

export default GlobalFooter