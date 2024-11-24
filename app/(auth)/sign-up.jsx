import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import icons from '../../constants/icons'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import GlobalFooter from '../../components/GlobalFooter'

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  }) 

  const [isSubmitting, setIsSubmitting ] = useState(false);

  const submit = async () => {
    if(form.username === "" || form.password === ""|| form.email === "") {
      Alert.alert('Error', "Please fill in all the fields")
      return
    }
    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);

      router.replace('/home')
    } catch (error) {
      if(error.message == 'AppwriteException: A user with the same id, email, or phone already exists in this project.') {
          router.push('/sign-in')
          Alert.alert('Error', 'User account already exists, please sign in')
          return
      }
      Alert.alert('Error', error.message)
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="h-full bg-tertiary">
      <ScrollView>
        <View className="w-full min-h-[90vh] items-center justify-center px-4">
          <View className="flex-row items-center mb-4 justify-center">
            <Image source={icons.logo} className="w-24 h-24" resizeMode="contain" />
            <Text className="text-5xl text-secondary font-lobster">Sign <Text className="text-primary">Up</Text></Text>
          </View>
          <FormField title="Username" value={form.username} placeholder="Enter here" handleChangeText={(e) => setForm({...form, username: e})} textStyles="text-2xl mt-4 mx-auto font-opensansItalic text-secondary" inputStyles="font-opensansRegular border-2 border-secondary bg-secondary text-xl text-Heading" />
          <FormField title="Email" value={form.email} placeholder="Enter here" handleChangeText={(e) => setForm({...form, email: e})} textStyles="text-2xl mt-4 mx-auto font-opensansItalic text-secondary" inputStyles="font-opensansRegular border-2 border-secondary bg-secondary text-xl text-Heading" keyBoardType="email-address" />
          <FormField title="Password" value={form.password} placeholder="Enter here" handleChangeText={(e) => setForm({...form, password: e})} textStyles="text-2xl mt-4 mx-auto font-opensansItalic text-secondary" inputStyles="font-opensansRegular border-2 border-secondary bg-secondary text-xl text-Heading" />
          <CustomButton title="Sign Up" handlePress={() => submit()} containerStyles="w-[70vw] mt-7 bg-primary border-primary" textStyles="text-secondary text-2xl font-lobster" isLoading={isSubmitting}/>
        </View>
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-xl font-opensansItalic text-secondary">Already have an account?</Text>
          <Link href="/sign-in" className="text-xl font-lobster p-1 pb-0 border-2 rounded-xl bg-secondary border-secondary">Sign In</Link>
        </View>
      </ScrollView>
      <GlobalFooter />
    </SafeAreaView>
  )
}

export default SignUp