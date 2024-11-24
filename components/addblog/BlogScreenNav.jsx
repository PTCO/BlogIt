import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import CustomButtonIcon from '../CustomButtonIcon'
import icons from '../../constants/icons'
import { useGlobalContext } from '../../context/GlobalProvider'

const BlogScreenNav = ({changeOffset}) => {
  const { user } = useGlobalContext();
  const [change, setChange] = useState(false)
  return (
    <View className="h-[80px] w-full flex-row justify-between items-center mt-4">
        <View className="flex-row self-start items-center mt-4">
          <Image source={{uri: user?.avatar}} className="w-12 h-12 rounded-xl mr-2" resizeMode='contain' />
          <View className="flex-row">
            <Text className="text-3xl text-primary font-lobster">{user?.username.substring(0, user?.username.length / 2)}</Text>
            <Text className="text-secondary text-3xl font-lobster">{user?.username.substring(user?.username.length / 2, user?.username.length)}</Text>
          </View>
        </View>
        <View className="flex-row">
            <CustomButtonIcon text={"Left"} iconStyles={"h-[20px] w-[40px]"} containerStyles={"flex-col items-center h-full mr-2"} textStyles={"hidden"} icon={icons.arrowLeft} handlePress={() => {setChange(pre => !pre); changeOffset(change ? "left":"right")}} />
            <CustomButtonIcon text={"Right"} iconStyles={"h-[20px] w-[40px]"} containerStyles="flex-col items-center h-full ml-2" textStyles={"hidden"} icon={icons.arrowRight} handlePress={() => {setChange(pre => !pre); changeOffset(!change ? "right":"right-full")}} />
        </View>
    </View>
  )
}

export default BlogScreenNav  