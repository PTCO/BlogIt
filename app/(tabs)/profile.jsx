import { View, Text, Image, FlatList, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { deleteAccount, getCurrentUser, getSavedBlogs, signOut, updateProfile } from '../../lib/appwrite'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../context/GlobalProvider'
import { router } from 'expo-router'
import icons from '../../constants/icons'

import CustomButtonIcon from '../../components/CustomButtonIcon'
import useAppwrite from '../../lib/useAppwrite'
import FormField from '../../components/FormField'
import * as DocumentPicker from 'expo-document-picker'
import { TouchableOpacity } from 'react-native'
import CustomButton from '../../components/CustomButton'
import GlobalFooter from '../../components/GlobalFooter'


const Profile = () => {
  const { setUser, user, setIsLoggedIn } = useGlobalContext();
  const { data:blogs }= useAppwrite(() => getSavedBlogs(user.$id));

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    currentUsername: '',
    newUsername: '',
    newAvatar: '',
    currentEmail: '',
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    userId: user?.$id,
    avatarfileid: user?.avatarimageid
  })

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(null);
    router.replace('/sign-in')
  }

  const onPicker = async () => {
    const upload = await DocumentPicker.getDocumentAsync({
        type: ['image/png', 'image/jpeg', 'image/tiff', 'image/tif']
    })
    if(!upload.canceled) {
      setForm({...form, newAvatar: upload.assets[0]})
    }
    else {
        Alert.alert('File select canceled, please try again')
    }
  }

  const submit = async(submission) => {
    const reset = () => {
      setForm({
        currentUsername: '',
        newUsername: '',
        newAvatar: '',
        currentEmail: '',
        newEmail: '',
        currentPassword: '',
        newPassword: '',
        userId: user.$id,
        avatarfileid: user.avatarimageid
      })
      setSubmitting(false);
    }

    try {
      setSubmitting(true);

      if(submission === 'deletion') {
        if(form.currentUsername === user?.username) {
          await deleteAccount(user.$id)
          .then(()=>{
            reset()
            setIsLoggedIn(false);
            router.replace('/')
          })
        }
        return
      }

      if(submission === 'username') {
        if(!form.currentUsername || !form.newUsername) {
          return Alert.alert('Please complete all fields for the form you are completing')
        }
      }
      else if (submission === 'avatar') {
        if(!form.newAvatar) {
          return Alert.alert('Please complete all fields for the form you are completing')
        }
      }
      else if (submission === 'email') {
        if(!form.currentEmail || !form.newEmail) {
          return Alert.alert('Please complete all fields for the form you are completing')
        }
      }
      else if (submission === 'password') {
        if(!form.currentPassword || !form.newPassword) {
          return Alert.alert('Please complete all fields for the form you are completing')
        }
      }
      await updateProfile(submission, form)
      .then((result) => {
        Alert.alert(result);
        getCurrentUser()
        .then((res) => setUser(res))
      })
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      reset()
    }
  }

  return (
    <SafeAreaView className="h-full items-center bg-tertiary px-4">
      <View className="flex-row w-full items-center border-b-2 border-primary my-4 mb-2 pb-4">
        <View className="flex-row items-center">
          <Image source={{uri: user?.avatar}} className="h-[45px] w-[45px] rounded-xl border-2 border-secondary mr-2" resizeMode='contain' />
          <Text className="text-secondary text-3xl font-lobster">Settings</Text>
        </View>
        <CustomButtonIcon icon={icons.logoutBtn} text={""} textStyles={"text-secondary mr-1 text-lg"} containerStyles={"bg-primary border-primary items-center justify-center  h-[50px] w-[50px]"} iconStyles={""} handlePress={logOut}/>
      </View>
      <ScrollView className="w-full mb-7">
        <Text className="text-3xl text-center text-secondary w-1/2 mx-auto mt-3 py-2 font-lobster">Account</Text>
        <View className="w-full h-auto justify-center bg-[#303030] shadow-xl rounded-xl pt-2 pb-4 px-4 mt-3">
          <FormField title={"Current username"} textStyles={"font-opensansItalic border-b-2 pb-2 mb-2 border-primary-alt text-secondary text-2xl"} value={form.currentUsername} containerStyles={"w-full my-2"} handleChangeText={(e) => setForm({...form, currentUsername: e})} />
          <FormField title={"Create a new username"} textStyles={"font-opensansItalic border-b-2 pb-2 mb-2 border-primary-alt text-secondary text-2xl"} value={form.newUsername} containerStyles={"w-full my-2"} handleChangeText={(e) => setForm({...form, newUsername: e})}/>
          <CustomButton title={"Update"} containerStyles={"bg-primary mt-3 h-[50px] w-1/2 ml-auto"} textStyles={"font-lobster text-secondary text-lg"} handlePress={() => submit('username')}/>
        </View>
        <View className="w-full h-auto justify-center bg-[#303030] shadow-xl rounded-xl pt-2 pb-4 px-4 mt-6">
          <Text className="font-opensansItalic border-b-2 pb-2 my-2 border-primary-alt text-2xl text-secondary">Choose a new profile picture</Text>
          {form.newAvatar ? 
          (
            <>
              <View>
                <Text className="text-xl mt-4 text-secondary font-lobster">File Selected</Text>
                <Text className="bg-primary-alt p-1 rounded-xl text-lg h-[37px] pl-3 mt-2 text-secondary font-opensansItalic">{form.newAvatar.uri}</Text>
              </View>
              <View className="flex-row">
                <CustomButton title={"Cancel"} containerStyles={"bg-gray-400 mt-5 h-[50px] w-[45%]"} textStyles={"font-lobster text-lg"} handlePress={() => setForm({
                  ...form, newAvatar: ''
                })}/>
                <CustomButton title={"Update"} containerStyles={"bg-primary mt-5 h-[50px] w-1/2 ml-auto"} textStyles={"font-lobster text-secondary text-lg"} handlePress={() => submit('avatar')}/>
              </View>
            </>
          )
          :
          (
            <>
              <TouchableOpacity onPress={() => onPicker()} className="mt-4">
                <View className="rounded-xl flex-row bg-secondary w-full h-16 items-center justify-center">
                    <Image source={icons.uploadButton} className="h-8 w-8 mr-1" resizeMode='contain' />
                    <Text className="text-lg font-opensansRegular">Select an image...</Text>
                </View>
              </TouchableOpacity>
              <CustomButton title={"Update"} containerStyles={"bg-primary mt-5 h-[50px] w-1/2 ml-auto"} textStyles={"font-lobster text-secondary text-lg"} handlePress={() => submit('avatar')}/>
            </>
          )
          }
        </View>
        <Text className="text-3xl text-center text-secondary w-1/2 mx-auto mt-7  py-2 font-lobster">Security</Text>
        <View className="w-full h-auto justify-center bg-[#303030] shadow-xl rounded-xl pt-2 pb-4 px-4 my-4">
          <FormField title={"Current email address"} textStyles={"font-opensansItalic border-b-2 pb-2 mb-2 border-primary-alt text-secondary text-2xl"} value={form.currentEmail} containerStyles={"w-full my-2"}  handleChangeText={(e) => setForm({...form, currentEmail: e})}/>
          <FormField title={"Update email address"} textStyles={"font-opensansItalic border-b-2 pb-2 mb-2 border-primary-alt text-secondary text-2xl"} value={form.newEmail} containerStyles={"w-full my-2"} handleChangeText={(e) => setForm({...form, newEmail: e})}/>
          <CustomButton title={"Update"} containerStyles={"bg-primary mt-3 h-[50px] w-1/2 ml-auto"} textStyles={"font-lobster text-secondary text-lg"} handlePress={() => submit('email')}/>
        </View>
        <View className="w-full h-auto justify-center bg-[#303030] shadow-xl rounded-xl pt-2 pb-4 px-4 mt-2 mb-9">
          <FormField title={"Current password"} textStyles={"font-opensansItalic border-b-2 pb-2 mb-2 border-primary-alt text-secondary text-2xl"} containerStyles={"w-full mb-2"} value={form.currentPassword} handleChangeText={(e) => setForm({...form, currentPassword: e})}/>
          <FormField title={"Create a new password"} textStyles={"font-opensansItalic border-b-2 pb-2 mb-2 border-primary-alt text-secondary text-2xl"} containerStyles={"w-full mb-2"} value={form.newPassword} handleChangeText={(e) => setForm({...form, newPassword: e})}/>
          <CustomButton title={"Update"} containerStyles={"bg-primary mt-3 h-[50px] w-1/2 ml-auto"} textStyles={"font-lobster text-secondary text-lg"} handlePress={() => submit('password')}/>
        </View>
        <Text className="text-3xl text-center text-secondary mx-auto mt-7 w-full  py-2 font-lobster">Account Deletion</Text>
        <View className="w-full h-auto justify-center bg-[#303030] shadow-xl rounded-xl pt-2 pb-4 px-4 mt-2 mb-9">
          <Text className="font-opensansItalic mb-1 text-secondary text-xl">When account deletion is requested, the following data is "deleted" & "lost":</Text>
          {['Acccount data', 'Account blog posts', 'Blog post data, i.e "images"', 'Account saved blogs'].map( text => (
            <Text key={text} className="font-opensansItalic text-secondary text-xl text-secondary border p-1 pl-2 bg-primary border-primary rounded-xl my-1.5 w-[75%]">{text}</Text>
          ))}
          <FormField title={`Enter username "${user?.username}"`} textStyles={"font-opensansItalic border-b-2 pb-2 mb-2 mt-3 border-primary-alt text-secondary text-2xl"} containerStyles={"w-full mb-2"} value={form.currentUsername} handleChangeText={(e) => setForm({...form, currentUsername: e})}/>
          <CustomButton title={"Delete Account"} containerStyles={"bg-primary mt-3 h-[50px] w-1/2 ml-auto"} textStyles={"font-lobster text-secondary text-lg"} handlePress={() => submit('deletion')}/>
        </View>
        <View className="border-t-2 border-primary pt-6">
          <GlobalFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile