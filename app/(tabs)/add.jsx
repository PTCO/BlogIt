import { View, Text, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BlogScreenNav from '../../components/addblog/BlogScreenNav'
import BlogOption from '../../components/addblog/BlogOption'

const NewBlog = () => {
  const [offset, setOffset] = useState(0)
  const [activeItem, setActiveItem] = useState(0)
  const changeOffset = (direction) => {
    if(direction === "left") setOffset(0)
    if(direction === "right") setOffset(360)
    if(direction === "right-full") setOffset(760)
  }


  return (
    <SafeAreaView className="bg-tertiary h-full w-full px-4">
      <BlogScreenNav changeOffset={changeOffset} />
      <FlatList 
      className=" h-[350px] "
      data={[1, 2, 3]}
      horizontal
      keyExtractor={(item) => item}
      renderItem={({item}) => (
        <BlogOption  option={item} activeItem={activeItem}/>
      )}
      contentOffset={{x: offset}}
      onViewableItemsChanged={(item) => {setActiveItem(item.changed[0].key); setOffset(null)}}
      viewabilityConfig={{itemVisiblePercentThreshold: 70}}
      />
    </SafeAreaView>
  )
}

export default NewBlog