import { Text, ImageBackground, View } from 'react-native'
import React, { useEffect } from 'react'
import BlogHeader from './BlogHeader'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import useAppwrite from '../../lib/useAppwrite'
import { getOneBlog } from '../../lib/appwrite'

const BlogPost = ({blog: {$id, date, title, thumbnails, saves, likes, author: { username, avatar}}}) => {
  const {data:blog, refetchData } = useAppwrite(() => getOneBlog($id));  
  const { setBlog } = useGlobalContext(); 
    const goToPost = () => {
      setBlog(blog);
      router.push(`/blog/${$id}`);
    }

  return (
    <TouchableOpacity className="w-full h-auto justify-center bg-[#303030] shadow-xl rounded-xl  py-3 px-4 my-4" onPress={() => goToPost()}>
        <BlogHeader username={username} saves={saves} likes={likes} avatar={avatar } date={date}/>
        <ImageBackground source={{uri: thumbnails[0]}} className="h-[150px] my-4" resizeMode='stretch'/>
        <View className="flex-row items-center mb-2">
          <Text className="text-2xl font-lobster text-primary">{title.substring(0, title.length / 2)}</Text>
          <Text className="text-2xl font-lobster text-secondary ">{title.substring(title.length / 2, title.length)}</Text>
        </View>    
        <Text className="mb-2 text-secondary text-s font-opensansItalic">{date}</Text>
      </TouchableOpacity>
  )
}

export default BlogPost