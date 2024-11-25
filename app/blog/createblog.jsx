import { View, Text, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import FormField from '../../components/FormField';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../context/GlobalProvider';
import * as DocumentPicker from 'expo-document-picker'
import { TouchableOpacity } from 'react-native';
import icons from '../../constants/icons';
import { Alert } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router';
import { createBlog } from '../../lib/appwrite';

const createblog = () => {
    const { user} = useGlobalContext();

    const [form, setForm] = useState({ 
        title: '',
        text: '',
        thumbnails: [],
        thumbnailView: ''
    })
    const [isSubmitting, setisSubmitting] = useState(false)

    const submit = async () => {
        if(!form.title || !form.text || !form.thumbnails) {
            return Alert.alert('Please fill in all fields')
        }
        if(form.title.length < 8) {
            return Alert.alert('Blog title should be at least 8 characters')
        }
        setisSubmitting(true);
        
        try {
            const data = await createBlog({...form, userId: user.$id});
            console.log(data);
            Alert.alert('Success', 'Blog has been uploaded!')
            router.push('/home')
        } catch (error) {
            Alert.alert('Error', 'Blog failed to upload')
        } finally {
            setForm({
                title: '',
                text: '',
                thumbnails: [],
                thumbnailView: ''
            })
            setisSubmitting(false)
        }
    }

    const onPicker = async (selectType) => {
        const upload = await DocumentPicker.getDocumentAsync({
            type: selectType === 'image' ? ['image/png', 'image/jpeg', 'image/tiff', 'image/tif']:['video/mp4']
        })

        if(!upload.canceled) {
            if(selectType === 'image') {
                setForm({...form, thumbnailView: upload.assets[0]})
            }
        }
        if(!upload.canceled) {
            if(selectType === 'video') {
                setForm({...form, thumbnailView: upload.assets[0]})
            }
        }
        else {
            Alert.alert('File select canceled, please try again')
        }
    }
    

  return (
    <SafeAreaView className="bg-tertiary h-full w-full px-4 pb-4">
        <View className="flex-row justify-between items-center border-b-2 border-primary pb-4 mt-2 mb-4 ">
            <Text className="font-lobster text-4xl text-secondary">Create</Text>
            <View className="flex-row items-center">
                <Image source={{uri: user?.avatar}} className="h-[45px] w-[45px] rounded-xl border-2 border-secondary mr-2" resizeMode='contain' />
                <View className="flex-row">
                    <Text className="text-3xl text-primary font-lobster">{user?.username.substring(0, user?.username.length / 2)}</Text>
                    <Text className="text-secondary text-3xl font-lobster">{user?.username.substring(user?.username.length / 2, user?.username.length)}</Text>
                </View>
            </View>
        </View>
        <ScrollView>
            <FormField title={"Title"} inputStyles={"text-primary-alt text-xl"} containerStyles={""} textStyles={"font-opensansItalic text-secondary"} handleChangeText={(e) => setForm({...form, title: e})}/>
            <FormField title={"Text"} inputStyles={"text-primary-alt text-xl"} containerStyles={"mt-5"} inputContainerStyles={"p-2 h-40 mt-5 items-start"} handleChangeText={(e) => setForm({...form, text: e})} multiline={true} textStyles={"font-opensansItalic text-secondary"}/>
            <View className="flex-row items-center mt-5 mb-2 border-b-2 border-primary-alt pb-3">
                <Text className="text-xl font-opensansItalic text-secondary ">Thumbnails  &  Videos</Text>
                <Text className="ml-2 text-secondary bg-primary px-2.5 py-0.5 rounded-lg font-opensansRegular text-lg">{form.thumbnails?.length}</Text>
            </View>
            <TouchableOpacity onPress={() => onPicker('image')} className={`mt-4 mb-8 ${form.thumbnailView ? 'hidden':''}`}>
                <View className="rounded-xl flex-row bg-secondary w-full h-16 items-center justify-center">
                    <Image source={icons.uploadButton} className="h-8 w-8 mr-1" resizeMode='contain' />
                    <Text className="text-lg font-opensansRegular">Select an image...</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPicker('video')} className={`${form.thumbnailView ? 'hidden':''}`}>
                <View className="rounded-xl flex-row bg-secondary w-full h-16 items-center justify-center">
                    <Image source={icons.uploadButton} className="h-8 w-8 mr-1" resizeMode='contain' />
                    <Text className="text-lg font-opensansRegular">Select an video...</Text>
                </View>
            </TouchableOpacity>
            <Video source={{uri: form.thumbnailView.uri}} className={`h-64 w-full mt-4 bg-black rounded-xl ${form.thumbnailView && form.thumbnailView.uri.includes('mp4') ? '':'hidden'}`} shouldPlay useNativeControls resizeMode={ResizeMode.CONTAIN} isLooping/>
            <Image source={{uri: form.thumbnailView.uri}} className={`h-64 w-full mt-4 bg-black rounded-xl ${form.thumbnailView &&  !form.thumbnailView.uri.includes('mp4') ? '':'hidden'}`} resizeMode='contain' />
            {form.thumbnailView && form.thumbnailView.uri ? (
                <CustomButton title={!form.thumbnailView.uri.includes('mp4') ? "Add Image": "Add Video" } containerStyles={"bg-primary-alt mt-5 h-[45px] w-1/2"} textStyles={"text-lg text-secondary pt-1 font-lobster"} handlePress={() => setForm({...form, thumbnails: [...form.thumbnails, form.thumbnailView], thumbnailView: '' })}/>
            ):null}
            <View className="border-t-2 border-primary-alt mt-6 pt-5">
                <CustomButton title="Submit" textStyles={"text-xl text-secondary pt-1 font-lobster"} containerStyles={"bg-primary"} isLoading={isSubmitting} handlePress={submit}/>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default createblog