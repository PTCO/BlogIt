import { View, Text, TextInput, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import  icons  from '../constants/icons'
import { TouchableOpacity } from 'react-native';

const FormField = ({title, value, containerStyles, multiline, placeholder, handleChangeText,inputContainerStyles, inputStyles, textStyles}) => {
    const inputRef = useRef(null);
    const [showSecured, setShowSecured] = useState(false)

    const handleFocus = () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
    };

  return (
    <View className={`${containerStyles}`}>
        <Text className={`text-xl ${textStyles}`}>{title}</Text>
        <TouchableOpacity onPress={() => handleFocus()} className={`flex-row bg-secondary w-full rounded-xl items-center h-16 mt-4 px-4 ${inputContainerStyles}`}>
          <TextInput ref={inputRef} multiline={multiline}  className={`w-full flex-1 rounded-xl  text-white  ${inputStyles}`} value={value} placeholder={placeholder} onChangeText={handleChangeText} secureTextEntry={title === "Password" && !showSecured} />
          {title === "Password" && (
            <TouchableOpacity onPress={()=> setShowSecured(!showSecured)}>
              <Image  source={showSecured ? icons.eye:icons.eyeHide} className="w-7 h-7" resizeMode='contain' /> 
            </TouchableOpacity>
          )}
        </TouchableOpacity>
    </View>
  )
}

export default FormField