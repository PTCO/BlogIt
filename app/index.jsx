import { Image, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import CustomButton from '../components/CustomButton'
import { Redirect, router } from 'expo-router'
import icons from '../constants/icons';
import { useGlobalContext } from '../context/GlobalProvider'
import GlobalFooter from '../components/GlobalFooter'

export default function App(){
  const { isLoading, isLoggedIn } = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href={"/home"} />

  return (
    <>
      <SafeAreaView className="flex-1 items-center justify-center h-full bg-tertiary">
        <ScrollView contentContainerStyle={{height: "100%"}}>
          <View className="w-full justify-center items-center px-4 h-[100vh]">
            <View className="flex-row items-center mb-8">
              <Image source={icons.logo} resizeMode='contain' className="w-24 h-24" />
              <Text className="text-5xl font-lobster text-secondary mt-4">Blog<Text className="text-primary">It</Text></Text>
            </View>
            <Image source={icons.onboardLogo} resizeMode='contain' className="mt-1 w-[300px] h-[300px]"/>
            <Text className="text-2xl font-opensansItalic text-center text-secondary mt-5">Engage in blogging & reading about interesting and captivating stories or articles from all over the world</Text>
            <CustomButton title="Welcome" handlePress={() => router.push('sign-up')} containerStyles="w-[70vw] mt-7 bg-primary border-primary " textStyles="text-secondary text-2xl font-lobster" />
          </View>
          <StatusBar style="dark" backgroundColor="#353535"/>
        </ScrollView>
        <GlobalFooter />
      </SafeAreaView>
    </>
  )
}
