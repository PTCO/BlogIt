import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import EmptyState from '../../components/EmptyState'
import BlogPost from '../../components/Blog/BlogPost'
import UserDisplay from '../../components/Home/UserDisplay'
import { getSavedBlogs } from '../../lib/appwrite'

const savedBlogs = () => {
    const { user } = useGlobalContext();
    const { data:blogs }= useAppwrite(() => getSavedBlogs(user.$id));

  return (
    <SafeAreaView className="h-full items-center px-4 bg-tertiary">
        <View className="w-full h-full pb-7">
            <UserDisplay />
            {blogs.length > 0 && (
            <View className="flex-row fixed  items-center w-full h-10 border-t-2 mt-5 pt-2 mb-2 border-primary">
                <Text className="bg-primary-alt text-3xl text-secondary mt-1 pr-2.5 pl-2 pb-2 font-opensansItalic rounded-lg mr-2">{blogs.length}</Text>
                <Text className="text-2xl font-lobster text-secondary mt-1 ">Your Saves</Text>
            </View>
            )}
            <FlatList 
                data={blogs}
                ListEmptyComponent={() => (<EmptyState />)}
                renderItem={({item}) => (
                <BlogPost blog={item.blog} />
                )}
            />
        </View>
    </SafeAreaView>
  ) 
}

export default savedBlogs