import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const CustomButtonIcon = ({text, icon, containerStyles, textStyles, iconStyles, handlePress}) => {
  return (
    <TouchableOpacity className={`flex-row ml-auto h-10 p-2 bg-primary-alt border-primary-alt border-2 rounded-lg ${containerStyles}`} onPress={() => handlePress()}>
        <Text className={`font-lobster ${textStyles}`}>{text}</Text>
        <Image source={icon} className={`h-full w-[30px] ${iconStyles}`} resizeMode='contain'/>
    </TouchableOpacity>
  )
}

export default CustomButtonIcon