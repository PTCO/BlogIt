import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'
import icons from '../../constants/icons'

const UserDisplay = () => {
    const { user } = useGlobalContext();
    return (
        <View className="flex-row w-full self-start items-center mt-4">
            <Image source={icons.logo} className="w-12 h-12 " resizeMode='contain' />
            <View className="flex-row items-center ml-auto">
                <Image source={{uri: user?.avatar}} className="h-[45px] w-[45px] rounded-xl border-2 border-secondary mr-2" resizeMode='contain' />
                <View className="flex-row">
                    <Text className="text-3xl text-primary font-lobster">{user?.username.substring(0, user?.username.length / 2)}</Text>
                    <Text className="text-secondary text-3xl font-lobster">{user?.username.substring(user?.username.length / 2, user?.username.length)}</Text>
                </View>
            </View>
        </View>
    )
}

export default UserDisplay