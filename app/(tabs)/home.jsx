import { View, Text, Image, FlatList, RefreshControl, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '../../constants/icons'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import useAppwrite from '../../lib/useAppwrite'
import { getAllBlogs } from '../../lib/appwrite'
import BlogPost from '../../components/Blog/BlogPost'
import * as Animatable from 'react-native-animatable';
import UserDisplay from '../../components/Home/UserDisplay'

const Home = () => {
  const { data:blogs, refetchData} = useAppwrite(getAllBlogs)
  const [refreshIt, setRefreshIt] = useState(false)
  const refresh = async () => {
    setRefreshIt(true);
    refetchData();
    setRefreshIt(false);
  }

  useEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress', ()=> {
      refetchData();
    })
  }, [])

  const zoomIn = {
    0: {
      scale: 0.9
    },
    1: {
      scale: 1.1
    },
    2: {
      scale: 0.9
    }
  }
  
  return (
    <SafeAreaView className="h-full items-center bg-tertiary">
      <View className="w-full h-full pb-7 px-3">
        <UserDisplay />
        <SearchInput />
        {blogs.length > 0 && (
          <View className="flex-row justify-end fixed  items-center w-full h-10 border-t-2 mt-5 pt-2 mb-2 border-primary">
            <Animatable.View animation={ zoomIn} duration={500} iterationCount={'infinite'} direction='alternate'>
              <Image source={icons.trendfeather} className="w-9 h-9 mr-1 " resizeMode='contain'/>
            </Animatable.View>
            <Text className="text-xl font-lobster text-secondary mt-1 ">Trending</Text>
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
          refreshControl={<RefreshControl refreshing={refreshIt} onRefresh={refresh} />}
        />
      </View>
    </SafeAreaView>
  )
}

export default Home