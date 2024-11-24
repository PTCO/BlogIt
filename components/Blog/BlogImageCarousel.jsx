import { View, Text, FlatList, Image } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Video, ResizeMode } from 'expo-av'
import React, { useState } from 'react'
import BlogVideo from './BlogVideo'

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.1
  },
}

const zoomOut = {
  0: {
    scale: 1.1
  },
  1: {
    scale: 0.9
  },
}

const BlogImageCarousel = ({thumbnails, imageStyles}) => {
  const [activeItem, setActiveItem] = useState(thumbnails[0]);

  const viewableItemsChanged = (index, item) => {
    setActiveItem(item[index])
  };

  return (
    <View className={`${thumbnails.length <= 1 ? 'mb-7':null}`}>
      <FlatList 
          horizontal
          data={thumbnails}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => (
              <Animatable.View duration={500} animation={activeItem === item ? zoomIn:zoomOut}>
                {item.includes('.mp4') ? 
                <BlogVideo uri={item}/>
                :
                <Image source={{uri: item}} className={`${imageStyles}`} resizeMode='stretch' />
                }
              </Animatable.View>
          )}
        onViewableItemsChanged={item => viewableItemsChanged(item["changed"][0].index,thumbnails)}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{ x: 170}}
        persistentScrollbar
      />
      <Text className={`text-center my-1 font-opensansRegular text-secondary ${thumbnails.length <= 1 ? 'hidden':null}`}>Scroll Horizontaly</Text>
    </View>
  )
}

export default BlogImageCarousel