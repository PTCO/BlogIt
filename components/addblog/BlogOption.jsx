import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import icons from '../../constants/icons'
import { TouchableOpacity } from 'react-native'
import * as Animation from 'react-native-animatable';
import { router } from 'expo-router';

const BlogOption = ({option, activeItem}) => {
  const zoomIn = {
    0: {
      scale: 0.9
    },
    1: {
      scale:1.025
    }
  }
  const zoomOut = {
    0: {
      scale: 1.1
    },
    1: {
      scale: 0.9
    }
  }

  return (
    <View>
      {option === 3 ?  
        (
          <Text className="text-4xl text-secondary mb-3 border-t-2 border-primary pl-0.5 pt-6 font-lobster">Saves</Text>
        )
        :
        (
          <Text className="text-4xl text-secondary mb-3 border-t-2 border-primary pl-0.5 pt-6 font-lobster">{option === 1 ? 'Create':'Your Blogs'}</Text>
        )
      }
      <Animation.View animation={activeItem === option ? zoomIn:zoomOut} duration={500}>
        {option === 3 ?  
        (
          <TouchableOpacity className={`w-[350px] h-[380px] justify-center items-center bg-[#303030] ml-2 mr-1 rounded-2xl mt-3 pt-4 shadow-xl`} onPress={() => router.push('/blog/savedblogs')}>
            <Image source={icons.blogSave} className="h-[320px] w-[270px]" resizeMode='contain'/>
          </TouchableOpacity>
        )
        :
        (
          <TouchableOpacity className={`w-[350px] h-[380px] justify-center items-center bg-[#303030] ${option === 1 ? 'ml-1 mr-1.5':'ml-1.5 mr-1'} rounded-2xl mt-3 pt-4 shadow-xl`} onPress={() => option === 1 ? router.push('/blog/createblog'):router.push('/blog/userblogs')}>
            <Image source={option === 1 ? icons.newBlog:icons.userBlogs} className="h-[320px] w-[270px]" resizeMode='contain'/>
          </TouchableOpacity>
        )}
      </Animation.View>
    </View>
  )
}

export default BlogOption