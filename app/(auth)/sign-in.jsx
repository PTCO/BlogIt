import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import icons from '../../constants/icons'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import GlobalFooter from '../../components/GlobalFooter'

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting ] = useState(false);
  
  const submit = async () => {
    if(!form.email || !form.password) {
      Alert.alert('Error', 'Please fill all fields')
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.message);
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
            <Text className="text-5xl text-secondary font-lobster">Sign <Text className="text-primary">In</Text></Text>
          </View>
          <FormField title="Email" value={form.email} placeholder="Enter here" handleChangeText={(e) => setForm({...form, email: e})} textStyles="text-2xl mt-4 mx-auto font-opensansItalic text-secondary" inputStyles="font-opensansRegular border-2 border-secondary bg-secondary text-xl text-Heading" />
          <FormField title="Password" value={form.password} placeholder="Enter here" handleChangeText={(e) => setForm({...form, password: e})} textStyles="text-2xl mt-4 mx-auto font-opensansItalic text-secondary" inputStyles="font-opensansRegular border-2 border-secondary bg-secondary text-xl text-Heading" />
          <CustomButton title="Sign In" handlePress={() => submit()} containerStyles="w-[70vw] mt-7 bg-primary border-primary" textStyles="text-secondary text-2xl font-lobster" isLoading={isSubmitting}/>
        </View>
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-xl font-opensansItalic text-secondary">Don't have an account?</Text>
          <Link href="/sign-up" className="text-xl font-lobster p-1 pb-0 border-2 rounded-xl bg-secondary border-secondary">Sign Up</Link>
        </View>
      </ScrollView>
      <GlobalFooter />
    </SafeAreaView>
  )
}

export default SignIn