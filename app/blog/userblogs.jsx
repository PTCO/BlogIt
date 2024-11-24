import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '../../lib/useAppwrite'
import { getUserBlogs } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import EmptyState from '../../components/EmptyState'
import BlogPost from '../../components/Blog/BlogPost'
import UserDisplay from '../../components/Home/UserDisplay'

const userBlogs = () => {
    const { user } = useGlobalContext();
    const {data:blogs, refetchData } = useAppwrite(() => getUserBlogs(user.$id))
    console.log(blogs);
  return (
    <SafeAreaView className="h-full items-center px-4 bg-tertiary">
        <View className="w-full h-full pb-7">
            <UserDisplay />
            {blogs.length > 0 && (
            <View className="flex-row fixed  items-center w-full h-10 border-t-2 mt-5 pt-2 mb-2 border-primary">
                <Text className="bg-primary-alt text-3xl text-secondary mt-1 pr-2.5 pl-2 pb-2 font-opensansItalic rounded-lg mr-2">{blogs.length}</Text>
                <Text className="text-2xl font-lobster text-secondary mt-1 ">Your Blogs</Text>
            </View>
            )}
            <FlatList 
            data={blogs}
            keyExtractor={(item) => item.$id}
            ListEmptyComponent={() => (<EmptyState />)}
            ListHeaderComponent={() => {}}
            renderItem={({item}) => (
                <BlogPost blog={item}/>
            )}
            />
        </View>
    </SafeAreaView>
  )
}

export default userBlogs