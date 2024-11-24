import { View, Text, Image, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '../../constants/icons'
import { TouchableOpacity } from 'react-native'
import BlogHeader from '../../components/Blog/BlogHeader'
import BlogImageCarousel from '../../components/Blog/BlogImageCarousel'
import { useGlobalContext } from '../../context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import useAppwrite from '../../lib/useAppwrite'
import { deleteBlog, getOneBlog, likeBlog, saveBlog, saveLikeCheck, unLikeBlog, unSaveBlog } from '../../lib/appwrite'
import { StatusBar } from 'expo-status-bar'
import CustomButton from '../../components/CustomButton'

const BlogPost = () => {
  const { refetchData } = useAppwrite(() => getOneBlog(query));
  const { blog, user} = useGlobalContext();
  const { query } = useLocalSearchParams();
  const { title, saves, likes, text, thumbnails } = blog;

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [consent, setConsent] = useState(false)

  useEffect(()=>{
    (async()=> {
      setIsLiked(await saveLikeCheck('likes', user.$id, blog.$id ));
      setIsSaved(await saveLikeCheck('saves', user.$id, blog.$id ));
    })()
  }, [blog])
  
  return (
    <SafeAreaView className="h-full px-4 py-2 bg-tertiary justify-center" >
      <BlogHeader username={blog.author?.username} saves={saves} likes={likes} avatar={blog.author?.avatar}/>
      <View className="flex-row items-center"> 
          <View className="border-primary border-t-2 w-80"></View>
          <Image source={icons.blogfeather} className="w-12 h-12" resizeMode='contain'/>
      </View>
      <BlogImageCarousel thumbnails={thumbnails} imageStyles={"h-[200px] w-[100vw]"}/>
      <View className="flex-row border-b-2 border-primary-alt text-primary pb-3 mb-3">
        <Text className="text-2xl font-lobster text-primary">{title.substring(0, title.length / 2)}</Text>
        <Text className="text-2xl font-lobster text-secondary ">{title.substring(title.length / 2, title.length)}</Text>
      </View>
      <ScrollView>
        <Text className="font-opensansItalic text-lg text-secondary">{text}</Text>
      </ScrollView>
      <View className="flex-row items-center mt-4">
        {blog.author.$id !== user.$id ? (
          <>
            <TouchableOpacity className={`flex-row h-10 p-2 ${isLiked ? 'bg-buttons-liked border-buttons-liked':'bg-primary-alt border-primary-alt'} border-2 rounded-lg mr-2`} onPress={async () => {
              isLiked ?
              await unLikeBlog(blog.$id, likes, user.$id)
              .then(()=>refetchData())
              :
              await likeBlog(blog.$id, likes, user.$id)
              .then(()=>refetchData())
            }}>
              <Text className={`font-lobster ${isLiked ? 'text-secondary':null}`}>{isLiked  ? 'Liked':'Like'}</Text>
              <Image source={isLiked ? icons.blogLiked:icons.blogLike} className="h-full w-[30px]" resizeMode='contain'/>
            </TouchableOpacity>
            <TouchableOpacity className={`flex-row h-10 p-2 ${isSaved  ? 'bg-buttons-saved border-buttons-saved':'bg-primary-alt border-primary-alt'} border-2 rounded-lg`} onPress={async () => {
              isSaved ?
              await unSaveBlog(blog.$id, saves, user.$id)
              .then(()=>refetchData())
              :
              await saveBlog(blog.$id, saves, user.$id)
              .then(()=>refetchData())
              }}>
              <Text className={`font-lobster ${isSaved ? 'text-secondary':null}`}>{isSaved   ? 'Saved':'Save'}</Text>
              <Image source={isSaved ? icons.blogSavedBtn:icons.blogSaveBtn} className="h-full w-[30px]" resizeMode='contain'/>
            </TouchableOpacity>
          </>
        ):
        (
          <>
            <TouchableOpacity className={`flex-row h-10 p-2 bg-primary-alt border-primary-alt border-2 rounded-lg mr-2`} onPress={async () => {
              setConsent(true);
              }}>
              <Text className={`font-lobster text-secondary`}>Delete</Text>
              <Image source={icons.blogDelete} className="h-full w-[30px]" resizeMode='contain'/>
            </TouchableOpacity>
            <TouchableOpacity className={`flex-row h-10 p-2 bg-primary-alt border-primary-alt border-2 rounded-lg`} onPress={() => {
              router.push('/blog/editblog')
            }}>
              <Text className={`font-lobster text-secondary`}>Edit</Text>
              <Image source={icons.blogEdit} className="h-full w-[30px]" resizeMode='contain'/>
            </TouchableOpacity>
          </>
        )
        }
        <TouchableOpacity className="flex-row ml-auto h-10 p-2 bg-primary-alt border-primary-alt border-2 rounded-lg" onPress={() => refetchData()}>
          <Text className="font-lobster">Refresh</Text>
          <Image source={icons.refresh} className="h-full w-[30px]" resizeMode='contain'/>
        </TouchableOpacity>
      </View>
      {consent ? (
        <View className="flex justify-center items-center absolute self-center rounded-xl p-2 border-2 bg-[#303030] shadow-xl w-[350px] h-[300px]">
          <Text className="text-2xl text-secondary text-center font-opensansItalic">Are you sure you would like to delete this blog?</Text>
          <View className="flex-row items-center mt-7">
            <CustomButton title={"Yes"} containerStyles={"bg-primary w-[90px] mx-2"} textStyles={"text-secondary font-lobster text-lg"} handlePress={async() => {
              await deleteBlog(blog.$id, blog.thumbnailids)
              .then(()=>router.replace('/home'))
            }} />
            <CustomButton title={"No"}  containerStyles={"bg-primary-alt w-[90px] mx-2"} textStyles={"text-secondary font-lobster text-lg"} handlePress={()=> setConsent(false)}/>
          </View>
        </View>
      ):null}
      <View className="flex-row items-center"> 
          <View className="border-primary border-t-2 w-80"></View>
          <Image source={icons.blogPenpoint} className="w-11 h-11" resizeMode='contain'/>
      </View>
      <StatusBar style="light" backgroundColor="#353535"/>
    </SafeAreaView>
)
}

export default BlogPost