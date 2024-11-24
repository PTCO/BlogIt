import { View, Text, Image, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../../constants/icons';
import { useGlobalContext } from '../../context/GlobalProvider';
import SearchInput from '../../components/SearchInput';
import useAppwrite from '../../lib/useAppwrite';
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite';
import BlogPost from '../../components/Blog/BlogPost';

const Search = () => {
  // const { data:blogs, refetchData } = useAppwrite(() => searchPosts(query));
  const { query } = useLocalSearchParams();
  // const { user } = useGlobalContext();

  console.log(query);

  useEffect(()=>{
    refetchData();
  }, [query])

  return (
    <SafeAreaView className="h-full items-center bg-tertiary">
      <View className="w-full h-full pb-7 px-3">
        <View className="flex-row items-center mt-4">
          <Image source={icons.logo} className="w-12 h-12 " resizeMode='contain' />
          <Text className="text-3xl text-primary font-lobster">{user.username.substring(0, user.username.length / 2)}<Text className="text-secondary">{user.username.substring(user.username.length / 2, user.username.length)}</Text></Text>
        </View>
        <SearchInput />
        {blogs.length > 0 && (
          <View className="flex-row justify-end fixed  items-center w-full h-10 border-t-2 mt-5 pt-2 mb-2 border-primary">
            <Text className="text-xl font-lobster text-secondary mt-1 ">Results</Text>
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

export default Search