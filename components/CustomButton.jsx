import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity className={`h-[65px] items-center justify-center rounded-xl ${containerStyles} ${isLoading ? 'opacity-50':''}`} onPress={handlePress} disabled={isLoading} activeOpacity={0.7}>
      <Text className={`${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton