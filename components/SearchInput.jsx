import { View, Text, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import  icons  from '../constants/icons'
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { router, usePathname } from 'expo-router';

const SearchInput = ({placeholder, inputStyles}) => {
  const pathname = usePathname();
    const [query, setQuery] = useState("");


  return (
    <View className="flex-row bg-secondary rounded-xl justify-end items-center h-12 mt-4">
        <TextInput className={`rounded-xl text-primary-alt text-lg font-opensansRegular h-full w-full px-2 ${inputStyles}`} value={query} placeholder={placeholder} onChangeText={(e) => setQuery(e)} />
        <TouchableOpacity onPress={()=> {
          if(!query) {
            Alert.alert('Search', 'Please provide a search value');
            return
          }
          if(pathname.startsWith('/search')) router.setParams({query});
          else router.push(`/search/${query}`)
        }} className="absolute bg-primary-alt w-12 h-12 rounded-r-xl">
            <Image  source={icons.search} className="w-8 h-8 mx-auto mt-2 " resizeMode='contain' /> 
        </TouchableOpacity>
    </View>
  )
}
 
export default SearchInput