import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { ResizeMode, Video } from 'expo-av'
import { TouchableOpacity } from 'react-native';
import icons from '../../constants/icons'

const BlogVideo = ({uri}) => {
    const [play, setPlay] = useState(true);
    const [urls, setUrls] = useState(uri.split("&"))


  return (
    <>
    {play ? 
    <Video source={{uri: urls[0]}} className="h-[200px] w-[100vw]" useNativeControls  resizeMode={ResizeMode.STRETCH} onPlaybackStatusUpdate={(status) => {
        if(status.didJustFinish) {
            setPlay(false)
        }
    }}/>
    :
    <TouchableOpacity onPress={() => setPlay(true)} className="items-center justify-center">
        <Image source={{uri: urls[1]}} className="h-[200px] w-[100vw]" resizeMode='stretch' />
        <Image source={icons.playButton} className="h-14 w-14 absolute" resizeMode='contain' />
    </TouchableOpacity>
    }
    </>
  )
}

export default BlogVideo