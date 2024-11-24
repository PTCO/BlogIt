import { View, Text, Image } from 'react-native'
import React from 'react'

const BlogHeader = ({username, saves, likes, avatar}) => {
  return (
    <View className="flex-row items-end w-full">
        <View className="flex-row items-center">
            <View className="h-[50px] w-[50px] rounded-xl border-primary-alt border-2">
            <Image source={{uri: avatar}} className="w-full h-full rounded-xl" resizeMode='cover'/>
            </View>
            <View className="ml-2">
                <Text className="text-lg font-opensansItalic text-secondary border-secondary border-b">Published By</Text>
                <View className="flex-row">
                    <Text className="text-xl text-primary font-lobster">{username.substring(0, username.length / 2)}</Text>
                    <Text className="text-secondary text-xl font-lobster">{username.substring(username.length / 2, username.length)}</Text>
                </View>
            </View>
        </View>
        <View className="flex-column items-start w-[150px] ml-auto mr-1">
            <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                    <Text className="text-lg text-primary-alt  mr-1 font-lobster">Likes</Text>
                    <Text className="text-lg border-2 pl-2 pr-1.5 text-secondary rounded-lg font-opensansRegular">{likes}</Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-lg text-primary-alt mr-1 font-lobster">Saves</Text>
                    <Text className="text-lg border-2 pl-2 pr-1.5 text-secondary rounded-lg font-opensansRegular">{saves}</Text>
                </View>
            </View>
        </View>
    </View>
  )
}

export default BlogHeader